#encoding: UTF-8
require "lib/social-economics/social_eco_importer"

class PenetracionInternet < SocialEcoImporter

  @codigo       = 'penetracion_internet'
  @unidades     = '% de penetración de internet en la población'

end

class LineasADSL < SocialEcoImporter

  @codigo       = 'lineas_adsl'
  @unidades     = '% de lineas adsl en la población'

end

class UsoRegularInternet < SocialEcoImporter

  @codigo       = 'uso_regular_internet'
  @unidades     = '% de usuarios regulares de internet'

end

class PrensaDiaria < SocialEcoImporter

  @codigo       = 'prensa_diaria'
  @unidades     = '% de población que leen prensa diaria'

end

class AudienciaDiariaTV < SocialEcoImporter

  @codigo       = 'audiencia_diaria_tv'
  @unidades     = '% de población que ven diariamente televisión'

end


PenetracionInternet.start!
LineasADSL.start!
UsoRegularInternet.start!
PrensaDiaria.start!
AudienciaDiariaTV.start!