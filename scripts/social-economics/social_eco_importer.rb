#encoding: UTF-8
require "rubygems"
require "ruby-debug"
require "bundler/setup"
require "csv"
require "cartodb-rb-client"
require "progress_bar"

CartoDB::Settings = YAML.load_file('config/cartodb_config.yml')
CartoDB::Connection = CartoDB::Client::Connection.new

class SocialEcoImporter
  def self.start!

    Dir["data/social-economic/#{@codigo}_gadm*"].each do |csv_file_path|

      @current_gadm = csv_file_path.match(/.*_gadm(\d+)\.csv/)[1].to_i

      next if @current_gadm == 3

      puts "Importing #{@codigo} data for gadm#{@current_gadm}..."

      csv_data = CSV.read(csv_file_path, :headers => true, :return_headers => false, :encoding => 'UTF-8')

      setup(csv_data.headers)

      store_data(csv_data)

      puts "... importing #{@codigo} data for gadm#{@current_gadm} done!"
    end

  end

  def self.setup(header)
    puts 'Setting up importer...'

    get_years(header)

    @variable = nil
    @sql = []
    @gadm_entities = nil

    @min_year      = @years.sort.first
    @max_year      = @years.sort.last

    calculate_min_max_gadm

    update_variables_table
    update_schemas
    puts '... setup done!'
    puts ''
  end

  def self.gadm_cartodb_id
    "gadm#{@current_gadm}_cartodb_id"
  end

  def self.table_names
    {
      1 => 'vars_socioeco_x_autonomia',
      2 => 'vars_socioeco_x_provincia',
      4 => 'vars_socioeco_x_municipio'
    }
  end

  def self.table_name
    table_name = table_names[@current_gadm]

    return table_name
  end

  def self.gadm_entities
    case @current_gadm
    when 1
      @gadm_entities ||= Hash[CartoDB::Connection.query('SELECT cartodb_id, cc_1, name_1 FROM gadm1;').rows.map{|m| [m.cc_1.to_i, m]}]
    when 2
      @gadm_entities ||= Hash[CartoDB::Connection.query('SELECT cartodb_id, cc_2, name_2 FROM gadm2;').rows.map{|m| [m.cc_2.to_i, m]}]
    when 4
      @gadm_entities ||= Hash[CartoDB::Connection.query('SELECT cartodb_id, ine_province_id, ine_municipality_id, name_4 FROM gadm4;').rows.map{|m| ["#{m.ine_province_id},#{m.ine_municipality_id}", m]}]
    end

  end

  def self.common_fields
    %w(id provincia_id municipio_id dc provincia nombre nombre_normalizado Column provincia2 ccaa)
  end

  def self.get_years(row)
    @years = (row - common_fields).map{|y| y.to_i}
  end

  def self.year_fields
    @years.map{|year| "#{@codigo}_#{year}"}
  end

  def self.variable
    @variable ||= CartoDB::Connection.query("SELECT cartodb_id, codigo, min_gadm, max_gadm FROM variables WHERE codigo = '#{@codigo}'").rows.first
  end

  def self.calculate_min_max_gadm

    @min_gadm = 1
    @max_gadm = 1
    if variable
      @min_gadm = variable.min_gadm
      @max_gadm = variable.max_gadm
    end

      @min_gadm = @current_gadm if @current_gadm < @min_gadm
      @max_gadm = @current_gadm if @current_gadm > @max_gadm

  end

  def self.update_variables_table
    if variable && variable.cartodb_id
      CartoDB::Connection.query("UPDATE variables SET (unidades, min_year, max_year, min_gadm, max_gadm) = ('#{@unidades}', #{@min_year}, #{@max_year}, #{@min_gadm}, #{@max_gadm}) WHERE cartodb_id = #{variable.cartodb_id};")
    else
      CartoDB::Connection.query("INSERT INTO variables (codigo, unidades, min_year, max_year, min_gadm, max_gadm) VALUES ('#{@codigo}', '#{@unidades}', #{@min_year}, #{@max_year}, #{@min_gadm}, #{@max_gadm});")
    end
  end

  def self.update_schemas
    @years.each do |year|
      begin
        CartoDB::Connection.query("ALTER TABLE #{table_name} ADD COLUMN #{@codigo}_#{year} numeric;")
      rescue Exception => e
      end
    end
  end

  def self.store_data(data)

    puts 'Saving data...'

    vars_table_data = {}
    table_name = table_names[@current_gadm]

    CartoDB::Connection.query("SELECT #{gadm_cartodb_id} FROM #{table_name}").rows.each{|r| vars_table_data[r["gadm#{@current_gadm}_cartodb_id".to_sym]] = r}

    bar = ProgressBar.new(data.count)

    data.each do |row|

      ine_id = ''
      existing_row = nil

      case @current_gadm
      when 1
        ine_id = row['dc'].to_i
      when 2
        ine_id = row['provincia_id'].to_i
      when 4
        ine_id = "#{row['provincia_id'].to_i},#{row['municipio_id'].to_i}"
      end

      gadm = gadm_entities[ine_id]

      bar.increment! and next if gadm.nil?

      if existing_row = vars_table_data[gadm.cartodb_id]

        @sql << <<-SQL
          UPDATE #{table_name}
          SET (#{year_fields.join(', ')})
          = (#{@years.map{|year| row[year.to_s] == '9999999' ? 'NULL' : row[year.to_s]}.join(', ')})
          WHERE #{gadm_cartodb_id} = #{existing_row[gadm_cartodb_id.to_sym]}
        SQL
      else
        @sql << <<-SQL
          INSERT INTO #{table_name}
          (#{gadm_cartodb_id}, #{year_fields.join(', ')})
          VALUES (#{gadm.cartodb_id}, #{@years.map{|year| row[year.to_s] == '9999999' ? 'NULL' : row[year.to_s]}.join(', ')})
        SQL
      end

      bar.increment!
    end

    CartoDB::Connection.query @sql.join(';')

    puts '... done!'
  end
end