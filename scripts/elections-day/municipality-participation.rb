
class MunicipalityParticipation
  include XML::SaxParser::Callbacks
  
  def on_start_document
    @result = {}
    @votantes_totales = nil
    @votos_en_blanco = nil
    @votos_nulos = nil
    @abstencion = nil
    @anteriores = false
  end
  
  def on_start_element(element, attributes)
    case element
      when 'NULOS_ABSOLUTO'
        @in_element = element
      when 'EN_BLANCO_ABSOLUTO'
        @in_element = element
      when 'PARTICIPACION_ABSOLUTO'
        @in_element = element
      when 'ABSTENCION_ABSOLUTO'
        @in_element = element
      when 'ANTERIORES'
        @anteriores = true        
    end
  end
  
  def on_end_element(element)
    case element
      when 'ANTERIORES'
        @anteriores = false
    end
  end
  
  def on_end_element(element)
    @in_element = nil
  end
  
  def on_characters(chars)
    return if @anteriores
    chars = chars.force_encoding('UTF-8').encode
    case @in_element
      when 'NULOS_ABSOLUTO'
        @votos_nulos = chars.to_i
      when 'EN_BLANCO_ABSOLUTO'
        @votos_en_blanco = chars.to_i
      when 'PARTICIPACION_ABSOLUTO'
        @votantes_totales = chars.to_i
      when 'ABSTENCION_ABSOLUTO'
        @abstencion = chars.to_i
    end
  end
  
  def on_end_document
    @final_result = {
      :mesas_electorales => nil, :censo_total=>(@votos_nulos + @votos_en_blanco + @votantes_totales + @abstencion), :votantes_totales=>@votantes_totales, :votos_validos=>(@votantes_totales - @votos_en_blanco - @votos_nulos), :votos_en_blanco=>@votos_en_blanco, :votos_nulos=>@votos_nulos, 
    }
  end
  
  def result
    @final_result
  end
  
end