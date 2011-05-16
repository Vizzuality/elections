#encoding: UTF-8
require "lib/social-economics/social_eco_importer"

class SecundariaAcabada < SocialEcoImporter

  @codigo       = 'secundaria_acabada'
  @unidades     = '% de población con educación secundaria terminada'

end

SecundariaAcabada.start!