class MunicipalityVotes
  include XML::SaxParser::Callbacks
  
  def initialize(municipio_id, codinemuni, codineprov)
    @municipio_id = municipio_id
    @codinemuni = codinemuni
    @codineprov = codineprov
  end
  
  def on_start_document
    @in_party = false
    @party_name = nil
    @result = {}
    @name = false
    @anteriores = false
  end
  
  def on_start_element(element, attributes)
    if element == 'ZONA'
      @municipality_name = nil
    elsif element == 'PARTIDO'
      @in_party = true
      @party_name = nil
    elsif element == 'ID'
      @almost_party_id = true
    elsif element == 'SIGLAS'
      @almost_party_name = true
    elsif element == 'PORCENTAJE'
      @almost_percentage = true if !@anteriores
    elsif element == 'VOTOS'
      @almost_votes = true if !@anteriores
    elsif element == 'ANTERIORES'
      @anteriores = true
    elsif element == 'NOMBRE'
      unless @in_party
        @name = true
      end
    end    
  end
  
  def on_end_element(element)
    case element
      when 'PARTIDO'
        @in_party = false
        @almost_percentage = false
        @party_name = nil
        @almost_party_name = false
      when'PORCENTAJE'
        @almost_percentage = false
      when 'VOTOS'
        @almost_votes = false
      when 'SIGLAS'
        @almost_party_name = false
      when 'NOMBRE'
        @name = false
      when 'ID'
        @almost_party_id = false
      when 'ANTERIORES'
        @anteriores = false
    end
  end
  
  def on_cdata_block(cdata)
    cdata = cdata.force_encoding('UTF-8').encode
    if @name
      @municipality_name = cdata
      @result["Partidos"] ||= {}
    elsif @almost_party_name
      @party_name = cdata
      @result["Partidos"][@party_name] ||= {"Votos" => nil, "Porcentaje" => nil, "ID" => @party_id}
      @party_id = nil
    end
  end
  
  def on_characters(chars)
    chars = chars.force_encoding('UTF-8').encode
    if @almost_percentage
      @result["Partidos"][@party_name]["Porcentaje"] = chars.strip.to_f
    elsif @almost_votes
      @result["Partidos"][@party_name]["Votos"] = chars.strip.to_f
    elsif @almost_party_id
      @party_id = chars.strip
    end
  end
  
  def on_end_document
    array = @result['Partidos'].map do |party_name,values|
      [party_name, values['Votos'],values['Porcentaje'], values['ID']]
    end.sort{ |b,a| a[1] <=> b[1]}
    
    # Insert all non existing parties
    array.each_with_index do |p,i|
      next if i > 2
      if $rparties[p[0]].nil?
        if $parties_ids[p[3]].nil?
          $cartodb.query("INSERT INTO partidos_politicos (name, siglas) VALUES ('#{p[0].gsub(/\'/,"\\\'")}', '#{p[3].gsub(/\'/,"\\\'")}')").rows
          puts ">> INSERT INTO partidos_politicos (name, siglas) VALUES ('#{p[0].gsub(/\'/,"\\\'")}', '#{p[3].gsub(/\'/,"\\\'")}')"
          rows = $cartodb.query("select cartodb_id, name, siglas from #{POLITICAL_PARTIES}")[:rows]
          $parties_ids = rows.inject({}){ |h, row| h[row[:siglas]] = row[:cartodb_id]; h}
          $parties = rows.inject({}){ |h, row| h[row[:cartodb_id]] = row[:name]; h}
          $rparties = $parties.invert
        end
      end
    end
    
    primer_partido_id = if array[0] && array[0][0]
      $rparties[array[0][0]] || $parties_ids[array[0][3]]
    else
      nil
    end
    raise "Primer partido NULL #{array[0].inspect}" if primer_partido_id.nil?

    segundo_partido_id = if array[1] && array[1][0]
      $rparties[array[1][0]] || $parties_ids[array[1][3]]
    else
      nil
    end
    raise "Segundo partido NULL #{array[1].inspect}" if segundo_partido_id.nil?
    
    tercer_partido_id = if array[2] && array[2][0]
      $rparties[array[2][0]] || $parties_ids[array[2][3]]
    else
      nil
    end        
    raise "Tercer partido NULL #{array[2].inspect}" if tercer_partido_id.nil?
    
    primer_partido_votos = if array[0] && array[0][1]
      array[0][1]
    else
      nil
    end
    
    segundo_partido_votos = if array[1] && array[1][1]
      array[1][1]
    else
      nil
    end
    
    tercer_partido_votos = if array[2] && array[2][1]
      array[2][1]
    else
      nil
    end
    
    primer_partido_percent = if array[0] && array[0][2]
      array[0][2]
    else
      nil
    end
    
    segundo_partido_percent = if array[1] && array[1][2]
      array[1][2]
    else
      nil
    end
    
    tercer_partido_percent = if array[2] && array[2][2]
      array[2][2]
    else
      nil
    end
    
    @final_result = {
      :municipio_id => @municipio_id, :proceso_electoral_id => 76, 
      :mesas_electorales => nil, :censo_total=>nil, :votantes_totales=>nil, :votos_validos=>nil, :votos_en_blanco=>nil, :votos_nulos=>nil, 
      :primer_partido_id => primer_partido_id, :segundo_partido_id => segundo_partido_id, :tercer_partido_id => tercer_partido_id, 
      :primer_partido_votos  => primer_partido_votos,  :primer_partido_percent=>primer_partido_percent, 
      :segundo_partido_votos => segundo_partido_votos, :segundo_partido_percent=>segundo_partido_percent, 
      :tercer_partido_votos  => tercer_partido_votos,  :tercer_partido_percent=>tercer_partido_percent, 
      :resto_partido_votos=>(array.size > 3 ? array[3..-1].inject(0){|sum,e| sum+=e[1]; sum} : nil), 
      :resto_partido_percent=>(100 - primer_partido_percent.to_i - segundo_partido_percent.to_i - tercer_partido_percent.to_i), 
      :codinemuni=>@codinemuni, :codineprov=>@codineprov 
    }
  end
  
  def result
    @final_result
  end  
end
