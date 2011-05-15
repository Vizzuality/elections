#encoding: UTF-8
require "lib/social-economics/social_eco_importer"

class ActividadEconomica  < SocialEcoImporter

  @codigo       = 'actividad_economica'
  @unidades     = 'índice de actividad económica'

end

class ActividadEconomicaNormalizada  < SocialEcoImporter

  @codigo       = 'actividad_economica_normalizado'
  @unidades     = 'desviación sobre la media del índice de actividad económica'

end

class Comercial  < SocialEcoImporter

  @codigo       = 'comercial'
  @unidades     = 'índice de actividad comercial'

end

class ComercialNormalizado  < SocialEcoImporter

  @codigo       = 'comercial_normalizado'
  @unidades     = 'desviación sobre la media del índice de actividad comercial'

end

class Restauracion  < SocialEcoImporter

  @codigo       = 'restauracion'
  @unidades     = 'índice de restauracion'

end

class RestauracionNormalizado  < SocialEcoImporter

  @codigo       = 'restauracion_normalizado'
  @unidades     = 'desviación sobre la media del índice de restauración'

end

class Turismo  < SocialEcoImporter

  @codigo       = 'turismo'
  @unidades     = 'índice de turismo'

end

class TurismoNormalizado  < SocialEcoImporter

  @codigo       = 'turismo_normalizado'
  @unidades     = 'desviación sobre la media del índice de turismo'

end

class PIB  < SocialEcoImporter

  @codigo       = 'pib'
  @unidades     = 'Producto Interior Bruto'

end

class PIBNormalizado  < SocialEcoImporter

  @codigo       = 'pib_normalizado'
  @unidades     = 'desviación sobre la media del Producto Interior Bruto'

end

class SalarioMedio  < SocialEcoImporter

  @codigo       = 'salario_medio'
  @unidades     = 'salario medio'

end

class SalarioMedioNormalizado  < SocialEcoImporter

  @codigo       = 'salario_medio_normalizado'
  @unidades     = 'desviación sobre la media del salario medio'

end

ActividadEconomica.start!
ActividadEconomicaNormalizada.start!
Comercial.start!
ComercialNormalizado.start!
Restauracion.start!
RestauracionNormalizado.start!
Turismo.start!
TurismoNormalizado.start!
PIB.start!
PIBNormalizado.start!
SalarioMedio.start!
SalarioMedioNormalizado.start!