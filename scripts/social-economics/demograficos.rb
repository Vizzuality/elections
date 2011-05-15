#encoding: UTF-8
require "lib/social-economics/social_eco_importer"

class EdadMediaAbsoluta < SocialEcoImporter

  @codigo       = 'edad_media_absoluta'
  @unidades     = 'edad media por municipio'

end

class EdadMediaNormalizado < SocialEcoImporter

  @codigo       = 'edad_media_normalizada'
  @unidades     = 'desviación sobre la media de edad por muncipio'

end

class Envejecimiento < SocialEcoImporter

  @codigo       = 'envejecimiento'
  @unidades     = 'índice de envejecimiento de la población'

end

class EnvejecimientoNormalizado < SocialEcoImporter

  @codigo       = 'envejecimiento_normalizado'
  @unidades     = 'desviación sobre la media del índice de envejecimiento de la población'

end

class SaldoVegetativo  < SocialEcoImporter

  @codigo       = 'saldo_vegetativo'
  @unidades     = 'saldo vegetativo'

end

class SaldoVegetativoNormalizado  < SocialEcoImporter

  @codigo       = 'saldo_vegetativo_normalizado'
  @unidades     = 'desviación sobre la media del saldo vegetativo'

end

class Inmigracion  < SocialEcoImporter

  @codigo       = 'inmigracion'
  @unidades     = 'inmigración'

end

class InmigracionNormalizado  < SocialEcoImporter

  @codigo       = 'inmigracion_normalizado'
  @unidades     = 'desviación sobre la media de la inmigración'

end


EdadMediaAbsoluta.start!
EdadMediaNormalizado.start!
Envejecimiento.start!
EnvejecimientoNormalizado.start!
SaldoVegetativo.start!
SaldoVegetativoNormalizado.start!
Inmigracion.start!
InmigracionNormalizado.start!