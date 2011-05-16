#encoding: UTF-8
require "lib/social-economics/social_eco_importer"

class ParoAbsoluto < SocialEcoImporter

  @codigo       = 'paro_absoluto'
  @unidades     = '% de la población total'

end

class ParoNormalizado < SocialEcoImporter

  @codigo       = 'paro_normalizado'
  @unidades     = 'desviación sobre la media de paro nacional por muncipio'

end


ParoAbsoluto.start!
ParoNormalizado.start!