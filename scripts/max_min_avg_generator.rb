# coding: UTF-8

require File.dirname(__FILE__) + "/common"

cartodb = get_cartodb_connection

File.open("#{ENV['HOME']}/Desktop/variables.json", 'w') do |file|
  file.write(variables_vars.first.to_json)
end

def queries_by_zoom(z)
  queries = {
    6  => (<<-SQL
    SELECT       edad_media_normalizado_min_max.*
,       detenidos_normalizado_min_max.*
,       envejecimiento_normalizado_min_max.*
,       inmigracion_normalizado_min_max.*
,       jovenes_parados_normalizado_min_max.*
,       saldo_vegetativo_normalizado_min_max.*
,       parados_larga_duracion_normalizado_min_max.*
,       matriculaciones_normalizado_min_max.*
,       pib_normalizado_min_max.*
,       salario_medio_normalizado_min_max.*
,       secundaria_acabada_normalizado_min_max.*
,       penetracion_internet_normalizado_min_max.*
,       audiencia_diaria_tv_normalizado_min_max.*
,       prensa_diaria_normalizado_min_max.*
,       paro_epa_normalizado_min_max.*

    FROM       (SELECT
                max(edad_media_normalizado_2000) as edad_media_normalizado_2000_max,
        min(edad_media_normalizado_2000) as edad_media_normalizado_2000_min,
        avg(edad_media_2000) as edad_media_normalizado_2000_avg
,         max(edad_media_normalizado_2001) as edad_media_normalizado_2001_max,
        min(edad_media_normalizado_2001) as edad_media_normalizado_2001_min,
        avg(edad_media_2001) as edad_media_normalizado_2001_avg
,         max(edad_media_normalizado_2002) as edad_media_normalizado_2002_max,
        min(edad_media_normalizado_2002) as edad_media_normalizado_2002_min,
        avg(edad_media_2002) as edad_media_normalizado_2002_avg
,         max(edad_media_normalizado_2003) as edad_media_normalizado_2003_max,
        min(edad_media_normalizado_2003) as edad_media_normalizado_2003_min,
        avg(edad_media_2003) as edad_media_normalizado_2003_avg
,         max(edad_media_normalizado_2004) as edad_media_normalizado_2004_max,
        min(edad_media_normalizado_2004) as edad_media_normalizado_2004_min,
        avg(edad_media_2004) as edad_media_normalizado_2004_avg
,         max(edad_media_normalizado_2005) as edad_media_normalizado_2005_max,
        min(edad_media_normalizado_2005) as edad_media_normalizado_2005_min,
        avg(edad_media_2005) as edad_media_normalizado_2005_avg
,         max(edad_media_normalizado_2006) as edad_media_normalizado_2006_max,
        min(edad_media_normalizado_2006) as edad_media_normalizado_2006_min,
        avg(edad_media_2006) as edad_media_normalizado_2006_avg
,         max(edad_media_normalizado_2007) as edad_media_normalizado_2007_max,
        min(edad_media_normalizado_2007) as edad_media_normalizado_2007_min,
        avg(edad_media_2007) as edad_media_normalizado_2007_avg
,         max(edad_media_normalizado_2008) as edad_media_normalizado_2008_max,
        min(edad_media_normalizado_2008) as edad_media_normalizado_2008_min,
        avg(edad_media_2008) as edad_media_normalizado_2008_avg
,         max(edad_media_normalizado_2009) as edad_media_normalizado_2009_max,
        min(edad_media_normalizado_2009) as edad_media_normalizado_2009_min,
        avg(edad_media_2009) as edad_media_normalizado_2009_avg
,         max(edad_media_normalizado_2010) as edad_media_normalizado_2010_max,
        min(edad_media_normalizado_2010) as edad_media_normalizado_2010_min,
        avg(edad_media_2010) as edad_media_normalizado_2010_avg

      FROM vars_socioeco_x_autonomia) AS edad_media_normalizado_min_max
,       (SELECT
                max(detenidos_normalizado_1993) as detenidos_normalizado_1993_max,
        min(detenidos_normalizado_1993) as detenidos_normalizado_1993_min,
        avg(detenidos_1993) as detenidos_normalizado_1993_avg
,         max(detenidos_normalizado_1994) as detenidos_normalizado_1994_max,
        min(detenidos_normalizado_1994) as detenidos_normalizado_1994_min,
        avg(detenidos_1994) as detenidos_normalizado_1994_avg
,         max(detenidos_normalizado_1995) as detenidos_normalizado_1995_max,
        min(detenidos_normalizado_1995) as detenidos_normalizado_1995_min,
        avg(detenidos_1995) as detenidos_normalizado_1995_avg
,         max(detenidos_normalizado_1996) as detenidos_normalizado_1996_max,
        min(detenidos_normalizado_1996) as detenidos_normalizado_1996_min,
        avg(detenidos_1996) as detenidos_normalizado_1996_avg
,         max(detenidos_normalizado_1997) as detenidos_normalizado_1997_max,
        min(detenidos_normalizado_1997) as detenidos_normalizado_1997_min,
        avg(detenidos_1997) as detenidos_normalizado_1997_avg
,         max(detenidos_normalizado_1998) as detenidos_normalizado_1998_max,
        min(detenidos_normalizado_1998) as detenidos_normalizado_1998_min,
        avg(detenidos_1998) as detenidos_normalizado_1998_avg
,         max(detenidos_normalizado_1999) as detenidos_normalizado_1999_max,
        min(detenidos_normalizado_1999) as detenidos_normalizado_1999_min,
        avg(detenidos_1999) as detenidos_normalizado_1999_avg
,         max(detenidos_normalizado_2000) as detenidos_normalizado_2000_max,
        min(detenidos_normalizado_2000) as detenidos_normalizado_2000_min,
        avg(detenidos_2000) as detenidos_normalizado_2000_avg
,         max(detenidos_normalizado_2001) as detenidos_normalizado_2001_max,
        min(detenidos_normalizado_2001) as detenidos_normalizado_2001_min,
        avg(detenidos_2001) as detenidos_normalizado_2001_avg
,         max(detenidos_normalizado_2002) as detenidos_normalizado_2002_max,
        min(detenidos_normalizado_2002) as detenidos_normalizado_2002_min,
        avg(detenidos_2002) as detenidos_normalizado_2002_avg
,         max(detenidos_normalizado_2003) as detenidos_normalizado_2003_max,
        min(detenidos_normalizado_2003) as detenidos_normalizado_2003_min,
        avg(detenidos_2003) as detenidos_normalizado_2003_avg
,         max(detenidos_normalizado_2004) as detenidos_normalizado_2004_max,
        min(detenidos_normalizado_2004) as detenidos_normalizado_2004_min,
        avg(detenidos_2004) as detenidos_normalizado_2004_avg
,         max(detenidos_normalizado_2005) as detenidos_normalizado_2005_max,
        min(detenidos_normalizado_2005) as detenidos_normalizado_2005_min,
        avg(detenidos_2005) as detenidos_normalizado_2005_avg
,         max(detenidos_normalizado_2006) as detenidos_normalizado_2006_max,
        min(detenidos_normalizado_2006) as detenidos_normalizado_2006_min,
        avg(detenidos_2006) as detenidos_normalizado_2006_avg
,         max(detenidos_normalizado_2007) as detenidos_normalizado_2007_max,
        min(detenidos_normalizado_2007) as detenidos_normalizado_2007_min,
        avg(detenidos_2007) as detenidos_normalizado_2007_avg
,         max(detenidos_normalizado_2008) as detenidos_normalizado_2008_max,
        min(detenidos_normalizado_2008) as detenidos_normalizado_2008_min,
        avg(detenidos_2008) as detenidos_normalizado_2008_avg
,         max(detenidos_normalizado_2009) as detenidos_normalizado_2009_max,
        min(detenidos_normalizado_2009) as detenidos_normalizado_2009_min,
        avg(detenidos_2009) as detenidos_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS detenidos_normalizado_min_max
,       (SELECT
                max(envejecimiento_normalizado_1991) as envejecimiento_normalizado_1991_max,
        min(envejecimiento_normalizado_1991) as envejecimiento_normalizado_1991_min,
        avg(envejecimiento_1991) as envejecimiento_normalizado_1991_avg
,         max(envejecimiento_normalizado_1992) as envejecimiento_normalizado_1992_max,
        min(envejecimiento_normalizado_1992) as envejecimiento_normalizado_1992_min,
        avg(envejecimiento_1992) as envejecimiento_normalizado_1992_avg
,         max(envejecimiento_normalizado_1993) as envejecimiento_normalizado_1993_max,
        min(envejecimiento_normalizado_1993) as envejecimiento_normalizado_1993_min,
        avg(envejecimiento_1993) as envejecimiento_normalizado_1993_avg
,         max(envejecimiento_normalizado_1994) as envejecimiento_normalizado_1994_max,
        min(envejecimiento_normalizado_1994) as envejecimiento_normalizado_1994_min,
        avg(envejecimiento_1994) as envejecimiento_normalizado_1994_avg
,         max(envejecimiento_normalizado_1995) as envejecimiento_normalizado_1995_max,
        min(envejecimiento_normalizado_1995) as envejecimiento_normalizado_1995_min,
        avg(envejecimiento_1995) as envejecimiento_normalizado_1995_avg
,         max(envejecimiento_normalizado_1996) as envejecimiento_normalizado_1996_max,
        min(envejecimiento_normalizado_1996) as envejecimiento_normalizado_1996_min,
        avg(envejecimiento_1996) as envejecimiento_normalizado_1996_avg
,         max(envejecimiento_normalizado_1997) as envejecimiento_normalizado_1997_max,
        min(envejecimiento_normalizado_1997) as envejecimiento_normalizado_1997_min,
        avg(envejecimiento_1997) as envejecimiento_normalizado_1997_avg
,         max(envejecimiento_normalizado_1998) as envejecimiento_normalizado_1998_max,
        min(envejecimiento_normalizado_1998) as envejecimiento_normalizado_1998_min,
        avg(envejecimiento_1998) as envejecimiento_normalizado_1998_avg
,         max(envejecimiento_normalizado_1999) as envejecimiento_normalizado_1999_max,
        min(envejecimiento_normalizado_1999) as envejecimiento_normalizado_1999_min,
        avg(envejecimiento_1999) as envejecimiento_normalizado_1999_avg
,         max(envejecimiento_normalizado_2000) as envejecimiento_normalizado_2000_max,
        min(envejecimiento_normalizado_2000) as envejecimiento_normalizado_2000_min,
        avg(envejecimiento_2000) as envejecimiento_normalizado_2000_avg
,         max(envejecimiento_normalizado_2001) as envejecimiento_normalizado_2001_max,
        min(envejecimiento_normalizado_2001) as envejecimiento_normalizado_2001_min,
        avg(envejecimiento_2001) as envejecimiento_normalizado_2001_avg
,         max(envejecimiento_normalizado_2002) as envejecimiento_normalizado_2002_max,
        min(envejecimiento_normalizado_2002) as envejecimiento_normalizado_2002_min,
        avg(envejecimiento_2002) as envejecimiento_normalizado_2002_avg
,         max(envejecimiento_normalizado_2003) as envejecimiento_normalizado_2003_max,
        min(envejecimiento_normalizado_2003) as envejecimiento_normalizado_2003_min,
        avg(envejecimiento_2003) as envejecimiento_normalizado_2003_avg
,         max(envejecimiento_normalizado_2004) as envejecimiento_normalizado_2004_max,
        min(envejecimiento_normalizado_2004) as envejecimiento_normalizado_2004_min,
        avg(envejecimiento_2004) as envejecimiento_normalizado_2004_avg
,         max(envejecimiento_normalizado_2005) as envejecimiento_normalizado_2005_max,
        min(envejecimiento_normalizado_2005) as envejecimiento_normalizado_2005_min,
        avg(envejecimiento_2005) as envejecimiento_normalizado_2005_avg
,         max(envejecimiento_normalizado_2006) as envejecimiento_normalizado_2006_max,
        min(envejecimiento_normalizado_2006) as envejecimiento_normalizado_2006_min,
        avg(envejecimiento_2006) as envejecimiento_normalizado_2006_avg
,         max(envejecimiento_normalizado_2007) as envejecimiento_normalizado_2007_max,
        min(envejecimiento_normalizado_2007) as envejecimiento_normalizado_2007_min,
        avg(envejecimiento_2007) as envejecimiento_normalizado_2007_avg
,         max(envejecimiento_normalizado_2008) as envejecimiento_normalizado_2008_max,
        min(envejecimiento_normalizado_2008) as envejecimiento_normalizado_2008_min,
        avg(envejecimiento_2008) as envejecimiento_normalizado_2008_avg
,         max(envejecimiento_normalizado_2009) as envejecimiento_normalizado_2009_max,
        min(envejecimiento_normalizado_2009) as envejecimiento_normalizado_2009_min,
        avg(envejecimiento_2009) as envejecimiento_normalizado_2009_avg
,         max(envejecimiento_normalizado_2010) as envejecimiento_normalizado_2010_max,
        min(envejecimiento_normalizado_2010) as envejecimiento_normalizado_2010_min,
        avg(envejecimiento_2010) as envejecimiento_normalizado_2010_avg
,         max(envejecimiento_normalizado_2011) as envejecimiento_normalizado_2011_max,
        min(envejecimiento_normalizado_2011) as envejecimiento_normalizado_2011_min,
        avg(envejecimiento_2011) as envejecimiento_normalizado_2011_avg

      FROM vars_socioeco_x_autonomia) AS envejecimiento_normalizado_min_max
,       (SELECT
                max(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_max,
        min(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_min,
        avg(inmigracion_1999) as inmigracion_normalizado_1999_avg
,         max(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_max,
        min(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_min,
        avg(inmigracion_2000) as inmigracion_normalizado_2000_avg
,         max(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_max,
        min(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_min,
        avg(inmigracion_2001) as inmigracion_normalizado_2001_avg
,         max(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_max,
        min(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_min,
        avg(inmigracion_2002) as inmigracion_normalizado_2002_avg
,         max(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_max,
        min(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_min,
        avg(inmigracion_2003) as inmigracion_normalizado_2003_avg
,         max(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_max,
        min(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_min,
        avg(inmigracion_2004) as inmigracion_normalizado_2004_avg
,         max(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_max,
        min(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_min,
        avg(inmigracion_2005) as inmigracion_normalizado_2005_avg
,         max(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_max,
        min(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_min,
        avg(inmigracion_2006) as inmigracion_normalizado_2006_avg
,         max(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_max,
        min(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_min,
        avg(inmigracion_2007) as inmigracion_normalizado_2007_avg
,         max(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_max,
        min(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_min,
        avg(inmigracion_2008) as inmigracion_normalizado_2008_avg
,         max(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_max,
        min(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_min,
        avg(inmigracion_2009) as inmigracion_normalizado_2009_avg
,         max(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_max,
        min(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_min,
        avg(inmigracion_2010) as inmigracion_normalizado_2010_avg

      FROM vars_socioeco_x_autonomia) AS inmigracion_normalizado_min_max
,       (SELECT
                max(jovenes_parados_normalizado_1991) as jovenes_parados_normalizado_1991_max,
        min(jovenes_parados_normalizado_1991) as jovenes_parados_normalizado_1991_min,
        avg(jovenes_parados_1991) as jovenes_parados_normalizado_1991_avg
,         max(jovenes_parados_normalizado_1992) as jovenes_parados_normalizado_1992_max,
        min(jovenes_parados_normalizado_1992) as jovenes_parados_normalizado_1992_min,
        avg(jovenes_parados_1992) as jovenes_parados_normalizado_1992_avg
,         max(jovenes_parados_normalizado_1993) as jovenes_parados_normalizado_1993_max,
        min(jovenes_parados_normalizado_1993) as jovenes_parados_normalizado_1993_min,
        avg(jovenes_parados_1993) as jovenes_parados_normalizado_1993_avg
,         max(jovenes_parados_normalizado_1994) as jovenes_parados_normalizado_1994_max,
        min(jovenes_parados_normalizado_1994) as jovenes_parados_normalizado_1994_min,
        avg(jovenes_parados_1994) as jovenes_parados_normalizado_1994_avg
,         max(jovenes_parados_normalizado_1995) as jovenes_parados_normalizado_1995_max,
        min(jovenes_parados_normalizado_1995) as jovenes_parados_normalizado_1995_min,
        avg(jovenes_parados_1995) as jovenes_parados_normalizado_1995_avg
,         max(jovenes_parados_normalizado_1996) as jovenes_parados_normalizado_1996_max,
        min(jovenes_parados_normalizado_1996) as jovenes_parados_normalizado_1996_min,
        avg(jovenes_parados_1996) as jovenes_parados_normalizado_1996_avg
,         max(jovenes_parados_normalizado_1997) as jovenes_parados_normalizado_1997_max,
        min(jovenes_parados_normalizado_1997) as jovenes_parados_normalizado_1997_min,
        avg(jovenes_parados_1997) as jovenes_parados_normalizado_1997_avg
,         max(jovenes_parados_normalizado_1998) as jovenes_parados_normalizado_1998_max,
        min(jovenes_parados_normalizado_1998) as jovenes_parados_normalizado_1998_min,
        avg(jovenes_parados_1998) as jovenes_parados_normalizado_1998_avg
,         max(jovenes_parados_normalizado_1999) as jovenes_parados_normalizado_1999_max,
        min(jovenes_parados_normalizado_1999) as jovenes_parados_normalizado_1999_min,
        avg(jovenes_parados_1999) as jovenes_parados_normalizado_1999_avg
,         max(jovenes_parados_normalizado_2000) as jovenes_parados_normalizado_2000_max,
        min(jovenes_parados_normalizado_2000) as jovenes_parados_normalizado_2000_min,
        avg(jovenes_parados_2000) as jovenes_parados_normalizado_2000_avg
,         max(jovenes_parados_normalizado_2001) as jovenes_parados_normalizado_2001_max,
        min(jovenes_parados_normalizado_2001) as jovenes_parados_normalizado_2001_min,
        avg(jovenes_parados_2001) as jovenes_parados_normalizado_2001_avg
,         max(jovenes_parados_normalizado_2002) as jovenes_parados_normalizado_2002_max,
        min(jovenes_parados_normalizado_2002) as jovenes_parados_normalizado_2002_min,
        avg(jovenes_parados_2002) as jovenes_parados_normalizado_2002_avg
,         max(jovenes_parados_normalizado_2003) as jovenes_parados_normalizado_2003_max,
        min(jovenes_parados_normalizado_2003) as jovenes_parados_normalizado_2003_min,
        avg(jovenes_parados_2003) as jovenes_parados_normalizado_2003_avg
,         max(jovenes_parados_normalizado_2004) as jovenes_parados_normalizado_2004_max,
        min(jovenes_parados_normalizado_2004) as jovenes_parados_normalizado_2004_min,
        avg(jovenes_parados_2004) as jovenes_parados_normalizado_2004_avg
,         max(jovenes_parados_normalizado_2005) as jovenes_parados_normalizado_2005_max,
        min(jovenes_parados_normalizado_2005) as jovenes_parados_normalizado_2005_min,
        avg(jovenes_parados_2005) as jovenes_parados_normalizado_2005_avg
,         max(jovenes_parados_normalizado_2006) as jovenes_parados_normalizado_2006_max,
        min(jovenes_parados_normalizado_2006) as jovenes_parados_normalizado_2006_min,
        avg(jovenes_parados_2006) as jovenes_parados_normalizado_2006_avg
,         max(jovenes_parados_normalizado_2007) as jovenes_parados_normalizado_2007_max,
        min(jovenes_parados_normalizado_2007) as jovenes_parados_normalizado_2007_min,
        avg(jovenes_parados_2007) as jovenes_parados_normalizado_2007_avg
,         max(jovenes_parados_normalizado_2008) as jovenes_parados_normalizado_2008_max,
        min(jovenes_parados_normalizado_2008) as jovenes_parados_normalizado_2008_min,
        avg(jovenes_parados_2008) as jovenes_parados_normalizado_2008_avg
,         max(jovenes_parados_normalizado_2009) as jovenes_parados_normalizado_2009_max,
        min(jovenes_parados_normalizado_2009) as jovenes_parados_normalizado_2009_min,
        avg(jovenes_parados_2009) as jovenes_parados_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS jovenes_parados_normalizado_min_max
,       (SELECT
                max(saldo_vegetativo_normalizado_1975) as saldo_vegetativo_normalizado_1975_max,
        min(saldo_vegetativo_normalizado_1975) as saldo_vegetativo_normalizado_1975_min,
        avg(saldo_vegetativo_1975) as saldo_vegetativo_normalizado_1975_avg
,         max(saldo_vegetativo_normalizado_1976) as saldo_vegetativo_normalizado_1976_max,
        min(saldo_vegetativo_normalizado_1976) as saldo_vegetativo_normalizado_1976_min,
        avg(saldo_vegetativo_1976) as saldo_vegetativo_normalizado_1976_avg
,         max(saldo_vegetativo_normalizado_1977) as saldo_vegetativo_normalizado_1977_max,
        min(saldo_vegetativo_normalizado_1977) as saldo_vegetativo_normalizado_1977_min,
        avg(saldo_vegetativo_1977) as saldo_vegetativo_normalizado_1977_avg
,         max(saldo_vegetativo_normalizado_1978) as saldo_vegetativo_normalizado_1978_max,
        min(saldo_vegetativo_normalizado_1978) as saldo_vegetativo_normalizado_1978_min,
        avg(saldo_vegetativo_1978) as saldo_vegetativo_normalizado_1978_avg
,         max(saldo_vegetativo_normalizado_1979) as saldo_vegetativo_normalizado_1979_max,
        min(saldo_vegetativo_normalizado_1979) as saldo_vegetativo_normalizado_1979_min,
        avg(saldo_vegetativo_1979) as saldo_vegetativo_normalizado_1979_avg
,         max(saldo_vegetativo_normalizado_1980) as saldo_vegetativo_normalizado_1980_max,
        min(saldo_vegetativo_normalizado_1980) as saldo_vegetativo_normalizado_1980_min,
        avg(saldo_vegetativo_1980) as saldo_vegetativo_normalizado_1980_avg
,         max(saldo_vegetativo_normalizado_1981) as saldo_vegetativo_normalizado_1981_max,
        min(saldo_vegetativo_normalizado_1981) as saldo_vegetativo_normalizado_1981_min,
        avg(saldo_vegetativo_1981) as saldo_vegetativo_normalizado_1981_avg
,         max(saldo_vegetativo_normalizado_1982) as saldo_vegetativo_normalizado_1982_max,
        min(saldo_vegetativo_normalizado_1982) as saldo_vegetativo_normalizado_1982_min,
        avg(saldo_vegetativo_1982) as saldo_vegetativo_normalizado_1982_avg
,         max(saldo_vegetativo_normalizado_1983) as saldo_vegetativo_normalizado_1983_max,
        min(saldo_vegetativo_normalizado_1983) as saldo_vegetativo_normalizado_1983_min,
        avg(saldo_vegetativo_1983) as saldo_vegetativo_normalizado_1983_avg
,         max(saldo_vegetativo_normalizado_1984) as saldo_vegetativo_normalizado_1984_max,
        min(saldo_vegetativo_normalizado_1984) as saldo_vegetativo_normalizado_1984_min,
        avg(saldo_vegetativo_1984) as saldo_vegetativo_normalizado_1984_avg
,         max(saldo_vegetativo_normalizado_1985) as saldo_vegetativo_normalizado_1985_max,
        min(saldo_vegetativo_normalizado_1985) as saldo_vegetativo_normalizado_1985_min,
        avg(saldo_vegetativo_1985) as saldo_vegetativo_normalizado_1985_avg
,         max(saldo_vegetativo_normalizado_1986) as saldo_vegetativo_normalizado_1986_max,
        min(saldo_vegetativo_normalizado_1986) as saldo_vegetativo_normalizado_1986_min,
        avg(saldo_vegetativo_1986) as saldo_vegetativo_normalizado_1986_avg
,         max(saldo_vegetativo_normalizado_1987) as saldo_vegetativo_normalizado_1987_max,
        min(saldo_vegetativo_normalizado_1987) as saldo_vegetativo_normalizado_1987_min,
        avg(saldo_vegetativo_1987) as saldo_vegetativo_normalizado_1987_avg
,         max(saldo_vegetativo_normalizado_1988) as saldo_vegetativo_normalizado_1988_max,
        min(saldo_vegetativo_normalizado_1988) as saldo_vegetativo_normalizado_1988_min,
        avg(saldo_vegetativo_1988) as saldo_vegetativo_normalizado_1988_avg
,         max(saldo_vegetativo_normalizado_1989) as saldo_vegetativo_normalizado_1989_max,
        min(saldo_vegetativo_normalizado_1989) as saldo_vegetativo_normalizado_1989_min,
        avg(saldo_vegetativo_1989) as saldo_vegetativo_normalizado_1989_avg
,         max(saldo_vegetativo_normalizado_1990) as saldo_vegetativo_normalizado_1990_max,
        min(saldo_vegetativo_normalizado_1990) as saldo_vegetativo_normalizado_1990_min,
        avg(saldo_vegetativo_1990) as saldo_vegetativo_normalizado_1990_avg
,         max(saldo_vegetativo_normalizado_1991) as saldo_vegetativo_normalizado_1991_max,
        min(saldo_vegetativo_normalizado_1991) as saldo_vegetativo_normalizado_1991_min,
        avg(saldo_vegetativo_1991) as saldo_vegetativo_normalizado_1991_avg
,         max(saldo_vegetativo_normalizado_1992) as saldo_vegetativo_normalizado_1992_max,
        min(saldo_vegetativo_normalizado_1992) as saldo_vegetativo_normalizado_1992_min,
        avg(saldo_vegetativo_1992) as saldo_vegetativo_normalizado_1992_avg
,         max(saldo_vegetativo_normalizado_1993) as saldo_vegetativo_normalizado_1993_max,
        min(saldo_vegetativo_normalizado_1993) as saldo_vegetativo_normalizado_1993_min,
        avg(saldo_vegetativo_1993) as saldo_vegetativo_normalizado_1993_avg
,         max(saldo_vegetativo_normalizado_1994) as saldo_vegetativo_normalizado_1994_max,
        min(saldo_vegetativo_normalizado_1994) as saldo_vegetativo_normalizado_1994_min,
        avg(saldo_vegetativo_1994) as saldo_vegetativo_normalizado_1994_avg
,         max(saldo_vegetativo_normalizado_1995) as saldo_vegetativo_normalizado_1995_max,
        min(saldo_vegetativo_normalizado_1995) as saldo_vegetativo_normalizado_1995_min,
        avg(saldo_vegetativo_1995) as saldo_vegetativo_normalizado_1995_avg
,         max(saldo_vegetativo_normalizado_1996) as saldo_vegetativo_normalizado_1996_max,
        min(saldo_vegetativo_normalizado_1996) as saldo_vegetativo_normalizado_1996_min,
        avg(saldo_vegetativo_1996) as saldo_vegetativo_normalizado_1996_avg
,         max(saldo_vegetativo_normalizado_1997) as saldo_vegetativo_normalizado_1997_max,
        min(saldo_vegetativo_normalizado_1997) as saldo_vegetativo_normalizado_1997_min,
        avg(saldo_vegetativo_1997) as saldo_vegetativo_normalizado_1997_avg
,         max(saldo_vegetativo_normalizado_1998) as saldo_vegetativo_normalizado_1998_max,
        min(saldo_vegetativo_normalizado_1998) as saldo_vegetativo_normalizado_1998_min,
        avg(saldo_vegetativo_1998) as saldo_vegetativo_normalizado_1998_avg
,         max(saldo_vegetativo_normalizado_1999) as saldo_vegetativo_normalizado_1999_max,
        min(saldo_vegetativo_normalizado_1999) as saldo_vegetativo_normalizado_1999_min,
        avg(saldo_vegetativo_1999) as saldo_vegetativo_normalizado_1999_avg
,         max(saldo_vegetativo_normalizado_2000) as saldo_vegetativo_normalizado_2000_max,
        min(saldo_vegetativo_normalizado_2000) as saldo_vegetativo_normalizado_2000_min,
        avg(saldo_vegetativo_2000) as saldo_vegetativo_normalizado_2000_avg
,         max(saldo_vegetativo_normalizado_2001) as saldo_vegetativo_normalizado_2001_max,
        min(saldo_vegetativo_normalizado_2001) as saldo_vegetativo_normalizado_2001_min,
        avg(saldo_vegetativo_2001) as saldo_vegetativo_normalizado_2001_avg
,         max(saldo_vegetativo_normalizado_2002) as saldo_vegetativo_normalizado_2002_max,
        min(saldo_vegetativo_normalizado_2002) as saldo_vegetativo_normalizado_2002_min,
        avg(saldo_vegetativo_2002) as saldo_vegetativo_normalizado_2002_avg
,         max(saldo_vegetativo_normalizado_2003) as saldo_vegetativo_normalizado_2003_max,
        min(saldo_vegetativo_normalizado_2003) as saldo_vegetativo_normalizado_2003_min,
        avg(saldo_vegetativo_2003) as saldo_vegetativo_normalizado_2003_avg
,         max(saldo_vegetativo_normalizado_2004) as saldo_vegetativo_normalizado_2004_max,
        min(saldo_vegetativo_normalizado_2004) as saldo_vegetativo_normalizado_2004_min,
        avg(saldo_vegetativo_2004) as saldo_vegetativo_normalizado_2004_avg
,         max(saldo_vegetativo_normalizado_2005) as saldo_vegetativo_normalizado_2005_max,
        min(saldo_vegetativo_normalizado_2005) as saldo_vegetativo_normalizado_2005_min,
        avg(saldo_vegetativo_2005) as saldo_vegetativo_normalizado_2005_avg
,         max(saldo_vegetativo_normalizado_2006) as saldo_vegetativo_normalizado_2006_max,
        min(saldo_vegetativo_normalizado_2006) as saldo_vegetativo_normalizado_2006_min,
        avg(saldo_vegetativo_2006) as saldo_vegetativo_normalizado_2006_avg
,         max(saldo_vegetativo_normalizado_2007) as saldo_vegetativo_normalizado_2007_max,
        min(saldo_vegetativo_normalizado_2007) as saldo_vegetativo_normalizado_2007_min,
        avg(saldo_vegetativo_2007) as saldo_vegetativo_normalizado_2007_avg
,         max(saldo_vegetativo_normalizado_2008) as saldo_vegetativo_normalizado_2008_max,
        min(saldo_vegetativo_normalizado_2008) as saldo_vegetativo_normalizado_2008_min,
        avg(saldo_vegetativo_2008) as saldo_vegetativo_normalizado_2008_avg
,         max(saldo_vegetativo_normalizado_2009) as saldo_vegetativo_normalizado_2009_max,
        min(saldo_vegetativo_normalizado_2009) as saldo_vegetativo_normalizado_2009_min,
        avg(saldo_vegetativo_2009) as saldo_vegetativo_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS saldo_vegetativo_normalizado_min_max
,       (SELECT
                max(parados_larga_duracion_normalizado_1991) as parados_larga_duracion_normalizado_1991_max,
        min(parados_larga_duracion_normalizado_1991) as parados_larga_duracion_normalizado_1991_min,
        avg(parados_larga_duracion_1991) as parados_larga_duracion_normalizado_1991_avg
,         max(parados_larga_duracion_normalizado_1992) as parados_larga_duracion_normalizado_1992_max,
        min(parados_larga_duracion_normalizado_1992) as parados_larga_duracion_normalizado_1992_min,
        avg(parados_larga_duracion_1992) as parados_larga_duracion_normalizado_1992_avg
,         max(parados_larga_duracion_normalizado_1993) as parados_larga_duracion_normalizado_1993_max,
        min(parados_larga_duracion_normalizado_1993) as parados_larga_duracion_normalizado_1993_min,
        avg(parados_larga_duracion_1993) as parados_larga_duracion_normalizado_1993_avg
,         max(parados_larga_duracion_normalizado_1994) as parados_larga_duracion_normalizado_1994_max,
        min(parados_larga_duracion_normalizado_1994) as parados_larga_duracion_normalizado_1994_min,
        avg(parados_larga_duracion_1994) as parados_larga_duracion_normalizado_1994_avg
,         max(parados_larga_duracion_normalizado_1995) as parados_larga_duracion_normalizado_1995_max,
        min(parados_larga_duracion_normalizado_1995) as parados_larga_duracion_normalizado_1995_min,
        avg(parados_larga_duracion_1995) as parados_larga_duracion_normalizado_1995_avg
,         max(parados_larga_duracion_normalizado_1996) as parados_larga_duracion_normalizado_1996_max,
        min(parados_larga_duracion_normalizado_1996) as parados_larga_duracion_normalizado_1996_min,
        avg(parados_larga_duracion_1996) as parados_larga_duracion_normalizado_1996_avg
,         max(parados_larga_duracion_normalizado_1997) as parados_larga_duracion_normalizado_1997_max,
        min(parados_larga_duracion_normalizado_1997) as parados_larga_duracion_normalizado_1997_min,
        avg(parados_larga_duracion_1997) as parados_larga_duracion_normalizado_1997_avg
,         max(parados_larga_duracion_normalizado_1998) as parados_larga_duracion_normalizado_1998_max,
        min(parados_larga_duracion_normalizado_1998) as parados_larga_duracion_normalizado_1998_min,
        avg(parados_larga_duracion_1998) as parados_larga_duracion_normalizado_1998_avg
,         max(parados_larga_duracion_normalizado_1999) as parados_larga_duracion_normalizado_1999_max,
        min(parados_larga_duracion_normalizado_1999) as parados_larga_duracion_normalizado_1999_min,
        avg(parados_larga_duracion_1999) as parados_larga_duracion_normalizado_1999_avg
,         max(parados_larga_duracion_normalizado_2000) as parados_larga_duracion_normalizado_2000_max,
        min(parados_larga_duracion_normalizado_2000) as parados_larga_duracion_normalizado_2000_min,
        avg(parados_larga_duracion_2000) as parados_larga_duracion_normalizado_2000_avg
,         max(parados_larga_duracion_normalizado_2001) as parados_larga_duracion_normalizado_2001_max,
        min(parados_larga_duracion_normalizado_2001) as parados_larga_duracion_normalizado_2001_min,
        avg(parados_larga_duracion_2001) as parados_larga_duracion_normalizado_2001_avg
,         max(parados_larga_duracion_normalizado_2002) as parados_larga_duracion_normalizado_2002_max,
        min(parados_larga_duracion_normalizado_2002) as parados_larga_duracion_normalizado_2002_min,
        avg(parados_larga_duracion_2002) as parados_larga_duracion_normalizado_2002_avg
,         max(parados_larga_duracion_normalizado_2003) as parados_larga_duracion_normalizado_2003_max,
        min(parados_larga_duracion_normalizado_2003) as parados_larga_duracion_normalizado_2003_min,
        avg(parados_larga_duracion_2003) as parados_larga_duracion_normalizado_2003_avg
,         max(parados_larga_duracion_normalizado_2004) as parados_larga_duracion_normalizado_2004_max,
        min(parados_larga_duracion_normalizado_2004) as parados_larga_duracion_normalizado_2004_min,
        avg(parados_larga_duracion_2004) as parados_larga_duracion_normalizado_2004_avg
,         max(parados_larga_duracion_normalizado_2005) as parados_larga_duracion_normalizado_2005_max,
        min(parados_larga_duracion_normalizado_2005) as parados_larga_duracion_normalizado_2005_min,
        avg(parados_larga_duracion_2005) as parados_larga_duracion_normalizado_2005_avg
,         max(parados_larga_duracion_normalizado_2006) as parados_larga_duracion_normalizado_2006_max,
        min(parados_larga_duracion_normalizado_2006) as parados_larga_duracion_normalizado_2006_min,
        avg(parados_larga_duracion_2006) as parados_larga_duracion_normalizado_2006_avg
,         max(parados_larga_duracion_normalizado_2007) as parados_larga_duracion_normalizado_2007_max,
        min(parados_larga_duracion_normalizado_2007) as parados_larga_duracion_normalizado_2007_min,
        avg(parados_larga_duracion_2007) as parados_larga_duracion_normalizado_2007_avg
,         max(parados_larga_duracion_normalizado_2008) as parados_larga_duracion_normalizado_2008_max,
        min(parados_larga_duracion_normalizado_2008) as parados_larga_duracion_normalizado_2008_min,
        avg(parados_larga_duracion_2008) as parados_larga_duracion_normalizado_2008_avg
,         max(parados_larga_duracion_normalizado_2009) as parados_larga_duracion_normalizado_2009_max,
        min(parados_larga_duracion_normalizado_2009) as parados_larga_duracion_normalizado_2009_min,
        avg(parados_larga_duracion_2009) as parados_larga_duracion_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS parados_larga_duracion_normalizado_min_max
,       (SELECT
                max(matriculaciones_normalizado_1997) as matriculaciones_normalizado_1997_max,
        min(matriculaciones_normalizado_1997) as matriculaciones_normalizado_1997_min,
        avg(matriculaciones_1997) as matriculaciones_normalizado_1997_avg
,         max(matriculaciones_normalizado_1998) as matriculaciones_normalizado_1998_max,
        min(matriculaciones_normalizado_1998) as matriculaciones_normalizado_1998_min,
        avg(matriculaciones_1998) as matriculaciones_normalizado_1998_avg
,         max(matriculaciones_normalizado_1999) as matriculaciones_normalizado_1999_max,
        min(matriculaciones_normalizado_1999) as matriculaciones_normalizado_1999_min,
        avg(matriculaciones_1999) as matriculaciones_normalizado_1999_avg
,         max(matriculaciones_normalizado_2000) as matriculaciones_normalizado_2000_max,
        min(matriculaciones_normalizado_2000) as matriculaciones_normalizado_2000_min,
        avg(matriculaciones_2000) as matriculaciones_normalizado_2000_avg
,         max(matriculaciones_normalizado_2001) as matriculaciones_normalizado_2001_max,
        min(matriculaciones_normalizado_2001) as matriculaciones_normalizado_2001_min,
        avg(matriculaciones_2001) as matriculaciones_normalizado_2001_avg
,         max(matriculaciones_normalizado_2002) as matriculaciones_normalizado_2002_max,
        min(matriculaciones_normalizado_2002) as matriculaciones_normalizado_2002_min,
        avg(matriculaciones_2002) as matriculaciones_normalizado_2002_avg
,         max(matriculaciones_normalizado_2003) as matriculaciones_normalizado_2003_max,
        min(matriculaciones_normalizado_2003) as matriculaciones_normalizado_2003_min,
        avg(matriculaciones_2003) as matriculaciones_normalizado_2003_avg
,         max(matriculaciones_normalizado_2004) as matriculaciones_normalizado_2004_max,
        min(matriculaciones_normalizado_2004) as matriculaciones_normalizado_2004_min,
        avg(matriculaciones_2004) as matriculaciones_normalizado_2004_avg
,         max(matriculaciones_normalizado_2005) as matriculaciones_normalizado_2005_max,
        min(matriculaciones_normalizado_2005) as matriculaciones_normalizado_2005_min,
        avg(matriculaciones_2005) as matriculaciones_normalizado_2005_avg
,         max(matriculaciones_normalizado_2006) as matriculaciones_normalizado_2006_max,
        min(matriculaciones_normalizado_2006) as matriculaciones_normalizado_2006_min,
        avg(matriculaciones_2006) as matriculaciones_normalizado_2006_avg
,         max(matriculaciones_normalizado_2007) as matriculaciones_normalizado_2007_max,
        min(matriculaciones_normalizado_2007) as matriculaciones_normalizado_2007_min,
        avg(matriculaciones_2007) as matriculaciones_normalizado_2007_avg
,         max(matriculaciones_normalizado_2008) as matriculaciones_normalizado_2008_max,
        min(matriculaciones_normalizado_2008) as matriculaciones_normalizado_2008_min,
        avg(matriculaciones_2008) as matriculaciones_normalizado_2008_avg
,         max(matriculaciones_normalizado_2009) as matriculaciones_normalizado_2009_max,
        min(matriculaciones_normalizado_2009) as matriculaciones_normalizado_2009_min,
        avg(matriculaciones_2009) as matriculaciones_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS matriculaciones_normalizado_min_max
,       (SELECT
                max(pib_normalizado_1999) as pib_normalizado_1999_max,
        min(pib_normalizado_1999) as pib_normalizado_1999_min,
        avg(pib_1999) as pib_normalizado_1999_avg
,         max(pib_normalizado_2000) as pib_normalizado_2000_max,
        min(pib_normalizado_2000) as pib_normalizado_2000_min,
        avg(pib_2000) as pib_normalizado_2000_avg
,         max(pib_normalizado_2001) as pib_normalizado_2001_max,
        min(pib_normalizado_2001) as pib_normalizado_2001_min,
        avg(pib_2001) as pib_normalizado_2001_avg
,         max(pib_normalizado_2002) as pib_normalizado_2002_max,
        min(pib_normalizado_2002) as pib_normalizado_2002_min,
        avg(pib_2002) as pib_normalizado_2002_avg
,         max(pib_normalizado_2003) as pib_normalizado_2003_max,
        min(pib_normalizado_2003) as pib_normalizado_2003_min,
        avg(pib_2003) as pib_normalizado_2003_avg
,         max(pib_normalizado_2004) as pib_normalizado_2004_max,
        min(pib_normalizado_2004) as pib_normalizado_2004_min,
        avg(pib_2004) as pib_normalizado_2004_avg
,         max(pib_normalizado_2005) as pib_normalizado_2005_max,
        min(pib_normalizado_2005) as pib_normalizado_2005_min,
        avg(pib_2005) as pib_normalizado_2005_avg
,         max(pib_normalizado_2006) as pib_normalizado_2006_max,
        min(pib_normalizado_2006) as pib_normalizado_2006_min,
        avg(pib_2006) as pib_normalizado_2006_avg
,         max(pib_normalizado_2007) as pib_normalizado_2007_max,
        min(pib_normalizado_2007) as pib_normalizado_2007_min,
        avg(pib_2007) as pib_normalizado_2007_avg
,         max(pib_normalizado_2008) as pib_normalizado_2008_max,
        min(pib_normalizado_2008) as pib_normalizado_2008_min,
        avg(pib_2008) as pib_normalizado_2008_avg

      FROM vars_socioeco_x_autonomia) AS pib_normalizado_min_max
,       (SELECT
                max(salario_medio_normalizado_1995) as salario_medio_normalizado_1995_max,
        min(salario_medio_normalizado_1995) as salario_medio_normalizado_1995_min,
        avg(salario_medio_1995) as salario_medio_normalizado_1995_avg
,         max(salario_medio_normalizado_1996) as salario_medio_normalizado_1996_max,
        min(salario_medio_normalizado_1996) as salario_medio_normalizado_1996_min,
        avg(salario_medio_1996) as salario_medio_normalizado_1996_avg
,         max(salario_medio_normalizado_1997) as salario_medio_normalizado_1997_max,
        min(salario_medio_normalizado_1997) as salario_medio_normalizado_1997_min,
        avg(salario_medio_1997) as salario_medio_normalizado_1997_avg
,         max(salario_medio_normalizado_1998) as salario_medio_normalizado_1998_max,
        min(salario_medio_normalizado_1998) as salario_medio_normalizado_1998_min,
        avg(salario_medio_1998) as salario_medio_normalizado_1998_avg
,         max(salario_medio_normalizado_1999) as salario_medio_normalizado_1999_max,
        min(salario_medio_normalizado_1999) as salario_medio_normalizado_1999_min,
        avg(salario_medio_1999) as salario_medio_normalizado_1999_avg
,         max(salario_medio_normalizado_2000) as salario_medio_normalizado_2000_max,
        min(salario_medio_normalizado_2000) as salario_medio_normalizado_2000_min,
        avg(salario_medio_2000) as salario_medio_normalizado_2000_avg
,         max(salario_medio_normalizado_2001) as salario_medio_normalizado_2001_max,
        min(salario_medio_normalizado_2001) as salario_medio_normalizado_2001_min,
        avg(salario_medio_2001) as salario_medio_normalizado_2001_avg
,         max(salario_medio_normalizado_2002) as salario_medio_normalizado_2002_max,
        min(salario_medio_normalizado_2002) as salario_medio_normalizado_2002_min,
        avg(salario_medio_2002) as salario_medio_normalizado_2002_avg
,         max(salario_medio_normalizado_2003) as salario_medio_normalizado_2003_max,
        min(salario_medio_normalizado_2003) as salario_medio_normalizado_2003_min,
        avg(salario_medio_2003) as salario_medio_normalizado_2003_avg
,         max(salario_medio_normalizado_2004) as salario_medio_normalizado_2004_max,
        min(salario_medio_normalizado_2004) as salario_medio_normalizado_2004_min,
        avg(salario_medio_2004) as salario_medio_normalizado_2004_avg
,         max(salario_medio_normalizado_2005) as salario_medio_normalizado_2005_max,
        min(salario_medio_normalizado_2005) as salario_medio_normalizado_2005_min,
        avg(salario_medio_2005) as salario_medio_normalizado_2005_avg
,         max(salario_medio_normalizado_2006) as salario_medio_normalizado_2006_max,
        min(salario_medio_normalizado_2006) as salario_medio_normalizado_2006_min,
        avg(salario_medio_2006) as salario_medio_normalizado_2006_avg
,         max(salario_medio_normalizado_2007) as salario_medio_normalizado_2007_max,
        min(salario_medio_normalizado_2007) as salario_medio_normalizado_2007_min,
        avg(salario_medio_2007) as salario_medio_normalizado_2007_avg
,         max(salario_medio_normalizado_2008) as salario_medio_normalizado_2008_max,
        min(salario_medio_normalizado_2008) as salario_medio_normalizado_2008_min,
        avg(salario_medio_2008) as salario_medio_normalizado_2008_avg
,         max(salario_medio_normalizado_2009) as salario_medio_normalizado_2009_max,
        min(salario_medio_normalizado_2009) as salario_medio_normalizado_2009_min,
        avg(salario_medio_2009) as salario_medio_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS salario_medio_normalizado_min_max
,       (SELECT
                max(secundaria_acabada_normalizado_2004) as secundaria_acabada_normalizado_2004_max,
        min(secundaria_acabada_normalizado_2004) as secundaria_acabada_normalizado_2004_min,
        avg(secundaria_acabada_2004) as secundaria_acabada_normalizado_2004_avg
,         max(secundaria_acabada_normalizado_2005) as secundaria_acabada_normalizado_2005_max,
        min(secundaria_acabada_normalizado_2005) as secundaria_acabada_normalizado_2005_min,
        avg(secundaria_acabada_2005) as secundaria_acabada_normalizado_2005_avg
,         max(secundaria_acabada_normalizado_2006) as secundaria_acabada_normalizado_2006_max,
        min(secundaria_acabada_normalizado_2006) as secundaria_acabada_normalizado_2006_min,
        avg(secundaria_acabada_2006) as secundaria_acabada_normalizado_2006_avg
,         max(secundaria_acabada_normalizado_2007) as secundaria_acabada_normalizado_2007_max,
        min(secundaria_acabada_normalizado_2007) as secundaria_acabada_normalizado_2007_min,
        avg(secundaria_acabada_2007) as secundaria_acabada_normalizado_2007_avg
,         max(secundaria_acabada_normalizado_2008) as secundaria_acabada_normalizado_2008_max,
        min(secundaria_acabada_normalizado_2008) as secundaria_acabada_normalizado_2008_min,
        avg(secundaria_acabada_2008) as secundaria_acabada_normalizado_2008_avg
,         max(secundaria_acabada_normalizado_2009) as secundaria_acabada_normalizado_2009_max,
        min(secundaria_acabada_normalizado_2009) as secundaria_acabada_normalizado_2009_min,
        avg(secundaria_acabada_2009) as secundaria_acabada_normalizado_2009_avg
,         max(secundaria_acabada_normalizado_2010) as secundaria_acabada_normalizado_2010_max,
        min(secundaria_acabada_normalizado_2010) as secundaria_acabada_normalizado_2010_min,
        avg(secundaria_acabada_2010) as secundaria_acabada_normalizado_2010_avg
,         max(secundaria_acabada_normalizado_2011) as secundaria_acabada_normalizado_2011_max,
        min(secundaria_acabada_normalizado_2011) as secundaria_acabada_normalizado_2011_min,
        avg(secundaria_acabada_2011) as secundaria_acabada_normalizado_2011_avg

      FROM vars_socioeco_x_autonomia) AS secundaria_acabada_normalizado_min_max
,       (SELECT
                max(penetracion_internet_normalizado_2004) as penetracion_internet_normalizado_2004_max,
        min(penetracion_internet_normalizado_2004) as penetracion_internet_normalizado_2004_min,
        avg(penetracion_internet_normalizado_2004) as penetracion_internet_normalizado_2004_avg
,         max(penetracion_internet_normalizado_2005) as penetracion_internet_normalizado_2005_max,
        min(penetracion_internet_normalizado_2005) as penetracion_internet_normalizado_2005_min,
        avg(penetracion_internet_normalizado_2005) as penetracion_internet_normalizado_2005_avg
,         max(penetracion_internet_normalizado_2006) as penetracion_internet_normalizado_2006_max,
        min(penetracion_internet_normalizado_2006) as penetracion_internet_normalizado_2006_min,
        avg(penetracion_internet_normalizado_2006) as penetracion_internet_normalizado_2006_avg
,         max(penetracion_internet_normalizado_2007) as penetracion_internet_normalizado_2007_max,
        min(penetracion_internet_normalizado_2007) as penetracion_internet_normalizado_2007_min,
        avg(penetracion_internet_normalizado_2007) as penetracion_internet_normalizado_2007_avg
,         max(penetracion_internet_normalizado_2008) as penetracion_internet_normalizado_2008_max,
        min(penetracion_internet_normalizado_2008) as penetracion_internet_normalizado_2008_min,
        avg(penetracion_internet_normalizado_2008) as penetracion_internet_normalizado_2008_avg
,         max(penetracion_internet_normalizado_2009) as penetracion_internet_normalizado_2009_max,
        min(penetracion_internet_normalizado_2009) as penetracion_internet_normalizado_2009_min,
        avg(penetracion_internet_normalizado_2009) as penetracion_internet_normalizado_2009_avg
,         max(penetracion_internet_normalizado_2010) as penetracion_internet_normalizado_2010_max,
        min(penetracion_internet_normalizado_2010) as penetracion_internet_normalizado_2010_min,
        avg(penetracion_internet_normalizado_2010) as penetracion_internet_normalizado_2010_avg

      FROM vars_socioeco_x_autonomia) AS penetracion_internet_normalizado_min_max
,       (SELECT
                max(audiencia_diaria_tv_normalizado_1997) as audiencia_diaria_tv_normalizado_1997_max,
        min(audiencia_diaria_tv_normalizado_1997) as audiencia_diaria_tv_normalizado_1997_min,
        avg(audiencia_diaria_tv_normalizado_1997) as audiencia_diaria_tv_normalizado_1997_avg
,         max(audiencia_diaria_tv_normalizado_1998) as audiencia_diaria_tv_normalizado_1998_max,
        min(audiencia_diaria_tv_normalizado_1998) as audiencia_diaria_tv_normalizado_1998_min,
        avg(audiencia_diaria_tv_normalizado_1998) as audiencia_diaria_tv_normalizado_1998_avg
,         max(audiencia_diaria_tv_normalizado_1999) as audiencia_diaria_tv_normalizado_1999_max,
        min(audiencia_diaria_tv_normalizado_1999) as audiencia_diaria_tv_normalizado_1999_min,
        avg(audiencia_diaria_tv_normalizado_1999) as audiencia_diaria_tv_normalizado_1999_avg
,         max(audiencia_diaria_tv_normalizado_2000) as audiencia_diaria_tv_normalizado_2000_max,
        min(audiencia_diaria_tv_normalizado_2000) as audiencia_diaria_tv_normalizado_2000_min,
        avg(audiencia_diaria_tv_normalizado_2000) as audiencia_diaria_tv_normalizado_2000_avg
,         max(audiencia_diaria_tv_normalizado_2001) as audiencia_diaria_tv_normalizado_2001_max,
        min(audiencia_diaria_tv_normalizado_2001) as audiencia_diaria_tv_normalizado_2001_min,
        avg(audiencia_diaria_tv_normalizado_2001) as audiencia_diaria_tv_normalizado_2001_avg
,         max(audiencia_diaria_tv_normalizado_2002) as audiencia_diaria_tv_normalizado_2002_max,
        min(audiencia_diaria_tv_normalizado_2002) as audiencia_diaria_tv_normalizado_2002_min,
        avg(audiencia_diaria_tv_normalizado_2002) as audiencia_diaria_tv_normalizado_2002_avg
,         max(audiencia_diaria_tv_normalizado_2003) as audiencia_diaria_tv_normalizado_2003_max,
        min(audiencia_diaria_tv_normalizado_2003) as audiencia_diaria_tv_normalizado_2003_min,
        avg(audiencia_diaria_tv_normalizado_2003) as audiencia_diaria_tv_normalizado_2003_avg
,         max(audiencia_diaria_tv_normalizado_2004) as audiencia_diaria_tv_normalizado_2004_max,
        min(audiencia_diaria_tv_normalizado_2004) as audiencia_diaria_tv_normalizado_2004_min,
        avg(audiencia_diaria_tv_normalizado_2004) as audiencia_diaria_tv_normalizado_2004_avg
,         max(audiencia_diaria_tv_normalizado_2005) as audiencia_diaria_tv_normalizado_2005_max,
        min(audiencia_diaria_tv_normalizado_2005) as audiencia_diaria_tv_normalizado_2005_min,
        avg(audiencia_diaria_tv_normalizado_2005) as audiencia_diaria_tv_normalizado_2005_avg
,         max(audiencia_diaria_tv_normalizado_2006) as audiencia_diaria_tv_normalizado_2006_max,
        min(audiencia_diaria_tv_normalizado_2006) as audiencia_diaria_tv_normalizado_2006_min,
        avg(audiencia_diaria_tv_normalizado_2006) as audiencia_diaria_tv_normalizado_2006_avg
,         max(audiencia_diaria_tv_normalizado_2007) as audiencia_diaria_tv_normalizado_2007_max,
        min(audiencia_diaria_tv_normalizado_2007) as audiencia_diaria_tv_normalizado_2007_min,
        avg(audiencia_diaria_tv_normalizado_2007) as audiencia_diaria_tv_normalizado_2007_avg
,         max(audiencia_diaria_tv_normalizado_2008) as audiencia_diaria_tv_normalizado_2008_max,
        min(audiencia_diaria_tv_normalizado_2008) as audiencia_diaria_tv_normalizado_2008_min,
        avg(audiencia_diaria_tv_normalizado_2008) as audiencia_diaria_tv_normalizado_2008_avg
,         max(audiencia_diaria_tv_normalizado_2009) as audiencia_diaria_tv_normalizado_2009_max,
        min(audiencia_diaria_tv_normalizado_2009) as audiencia_diaria_tv_normalizado_2009_min,
        avg(audiencia_diaria_tv_normalizado_2009) as audiencia_diaria_tv_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS audiencia_diaria_tv_normalizado_min_max
,       (SELECT
                max(prensa_diaria_normalizado_2000) as prensa_diaria_normalizado_2000_max,
        min(prensa_diaria_normalizado_2000) as prensa_diaria_normalizado_2000_min,
        avg(prensa_diaria_normalizado_2000) as prensa_diaria_normalizado_2000_avg
,         max(prensa_diaria_normalizado_2001) as prensa_diaria_normalizado_2001_max,
        min(prensa_diaria_normalizado_2001) as prensa_diaria_normalizado_2001_min,
        avg(prensa_diaria_normalizado_2001) as prensa_diaria_normalizado_2001_avg
,         max(prensa_diaria_normalizado_2002) as prensa_diaria_normalizado_2002_max,
        min(prensa_diaria_normalizado_2002) as prensa_diaria_normalizado_2002_min,
        avg(prensa_diaria_normalizado_2002) as prensa_diaria_normalizado_2002_avg
,         max(prensa_diaria_normalizado_2003) as prensa_diaria_normalizado_2003_max,
        min(prensa_diaria_normalizado_2003) as prensa_diaria_normalizado_2003_min,
        avg(prensa_diaria_normalizado_2003) as prensa_diaria_normalizado_2003_avg
,         max(prensa_diaria_normalizado_2004) as prensa_diaria_normalizado_2004_max,
        min(prensa_diaria_normalizado_2004) as prensa_diaria_normalizado_2004_min,
        avg(prensa_diaria_normalizado_2004) as prensa_diaria_normalizado_2004_avg
,         max(prensa_diaria_normalizado_2005) as prensa_diaria_normalizado_2005_max,
        min(prensa_diaria_normalizado_2005) as prensa_diaria_normalizado_2005_min,
        avg(prensa_diaria_normalizado_2005) as prensa_diaria_normalizado_2005_avg
,         max(prensa_diaria_normalizado_2006) as prensa_diaria_normalizado_2006_max,
        min(prensa_diaria_normalizado_2006) as prensa_diaria_normalizado_2006_min,
        avg(prensa_diaria_normalizado_2006) as prensa_diaria_normalizado_2006_avg
,         max(prensa_diaria_normalizado_2007) as prensa_diaria_normalizado_2007_max,
        min(prensa_diaria_normalizado_2007) as prensa_diaria_normalizado_2007_min,
        avg(prensa_diaria_normalizado_2007) as prensa_diaria_normalizado_2007_avg
,         max(prensa_diaria_normalizado_2008) as prensa_diaria_normalizado_2008_max,
        min(prensa_diaria_normalizado_2008) as prensa_diaria_normalizado_2008_min,
        avg(prensa_diaria_normalizado_2008) as prensa_diaria_normalizado_2008_avg
,         max(prensa_diaria_normalizado_2009) as prensa_diaria_normalizado_2009_max,
        min(prensa_diaria_normalizado_2009) as prensa_diaria_normalizado_2009_min,
        avg(prensa_diaria_normalizado_2009) as prensa_diaria_normalizado_2009_avg

      FROM vars_socioeco_x_autonomia) AS prensa_diaria_normalizado_min_max
,       (SELECT
                max(paro_epa_normalizado_2005) as paro_epa_normalizado_2005_max,
        min(paro_epa_normalizado_2005) as paro_epa_normalizado_2005_min,
        avg(paro_epa_2005) as paro_epa_normalizado_2005_avg
,         max(paro_epa_normalizado_2006) as paro_epa_normalizado_2006_max,
        min(paro_epa_normalizado_2006) as paro_epa_normalizado_2006_min,
        avg(paro_epa_2006) as paro_epa_normalizado_2006_avg
,         max(paro_epa_normalizado_2007) as paro_epa_normalizado_2007_max,
        min(paro_epa_normalizado_2007) as paro_epa_normalizado_2007_min,
        avg(paro_epa_2007) as paro_epa_normalizado_2007_avg
,         max(paro_epa_normalizado_2008) as paro_epa_normalizado_2008_max,
        min(paro_epa_normalizado_2008) as paro_epa_normalizado_2008_min,
        avg(paro_epa_2008) as paro_epa_normalizado_2008_avg
,         max(paro_epa_normalizado_2009) as paro_epa_normalizado_2009_max,
        min(paro_epa_normalizado_2009) as paro_epa_normalizado_2009_min,
        avg(paro_epa_2009) as paro_epa_normalizado_2009_avg
,         max(paro_epa_normalizado_2010) as paro_epa_normalizado_2010_max,
        min(paro_epa_normalizado_2010) as paro_epa_normalizado_2010_min,
        avg(paro_epa_2010) as paro_epa_normalizado_2010_avg
,         max(paro_epa_normalizado_2011) as paro_epa_normalizado_2011_max,
        min(paro_epa_normalizado_2011) as paro_epa_normalizado_2011_min,
        avg(paro_epa_2011) as paro_epa_normalizado_2011_avg

      FROM vars_socioeco_x_autonomia) AS paro_epa_normalizado_min_max
    SQL
    ),
    7  => (<<-SQL
    SELECT       detenidos_normalizado_min_max.*
,       envejecimiento_normalizado_min_max.*
,       pib_normalizado_min_max.*
,       inmigracion_normalizado_min_max.*
,       saldo_vegetativo_normalizado_min_max.*
,       matriculaciones_normalizado_min_max.*
,       edad_media_normalizado_min_max.*

    FROM       (SELECT
                max(detenidos_normalizado_1993) as detenidos_normalizado_1993_max,
        min(detenidos_normalizado_1993) as detenidos_normalizado_1993_min,
        avg(detenidos_1993) as detenidos_normalizado_1993_avg
,         max(detenidos_normalizado_1994) as detenidos_normalizado_1994_max,
        min(detenidos_normalizado_1994) as detenidos_normalizado_1994_min,
        avg(detenidos_1994) as detenidos_normalizado_1994_avg
,         max(detenidos_normalizado_1995) as detenidos_normalizado_1995_max,
        min(detenidos_normalizado_1995) as detenidos_normalizado_1995_min,
        avg(detenidos_1995) as detenidos_normalizado_1995_avg
,         max(detenidos_normalizado_1996) as detenidos_normalizado_1996_max,
        min(detenidos_normalizado_1996) as detenidos_normalizado_1996_min,
        avg(detenidos_1996) as detenidos_normalizado_1996_avg
,         max(detenidos_normalizado_1997) as detenidos_normalizado_1997_max,
        min(detenidos_normalizado_1997) as detenidos_normalizado_1997_min,
        avg(detenidos_1997) as detenidos_normalizado_1997_avg
,         max(detenidos_normalizado_1998) as detenidos_normalizado_1998_max,
        min(detenidos_normalizado_1998) as detenidos_normalizado_1998_min,
        avg(detenidos_1998) as detenidos_normalizado_1998_avg
,         max(detenidos_normalizado_1999) as detenidos_normalizado_1999_max,
        min(detenidos_normalizado_1999) as detenidos_normalizado_1999_min,
        avg(detenidos_1999) as detenidos_normalizado_1999_avg
,         max(detenidos_normalizado_2000) as detenidos_normalizado_2000_max,
        min(detenidos_normalizado_2000) as detenidos_normalizado_2000_min,
        avg(detenidos_2000) as detenidos_normalizado_2000_avg
,         max(detenidos_normalizado_2001) as detenidos_normalizado_2001_max,
        min(detenidos_normalizado_2001) as detenidos_normalizado_2001_min,
        avg(detenidos_2001) as detenidos_normalizado_2001_avg
,         max(detenidos_normalizado_2002) as detenidos_normalizado_2002_max,
        min(detenidos_normalizado_2002) as detenidos_normalizado_2002_min,
        avg(detenidos_2002) as detenidos_normalizado_2002_avg
,         max(detenidos_normalizado_2003) as detenidos_normalizado_2003_max,
        min(detenidos_normalizado_2003) as detenidos_normalizado_2003_min,
        avg(detenidos_2003) as detenidos_normalizado_2003_avg
,         max(detenidos_normalizado_2004) as detenidos_normalizado_2004_max,
        min(detenidos_normalizado_2004) as detenidos_normalizado_2004_min,
        avg(detenidos_2004) as detenidos_normalizado_2004_avg
,         max(detenidos_normalizado_2005) as detenidos_normalizado_2005_max,
        min(detenidos_normalizado_2005) as detenidos_normalizado_2005_min,
        avg(detenidos_2005) as detenidos_normalizado_2005_avg
,         max(detenidos_normalizado_2006) as detenidos_normalizado_2006_max,
        min(detenidos_normalizado_2006) as detenidos_normalizado_2006_min,
        avg(detenidos_2006) as detenidos_normalizado_2006_avg
,         max(detenidos_normalizado_2007) as detenidos_normalizado_2007_max,
        min(detenidos_normalizado_2007) as detenidos_normalizado_2007_min,
        avg(detenidos_2007) as detenidos_normalizado_2007_avg
,         max(detenidos_normalizado_2008) as detenidos_normalizado_2008_max,
        min(detenidos_normalizado_2008) as detenidos_normalizado_2008_min,
        avg(detenidos_2008) as detenidos_normalizado_2008_avg
,         max(detenidos_normalizado_2009) as detenidos_normalizado_2009_max,
        min(detenidos_normalizado_2009) as detenidos_normalizado_2009_min,
        avg(detenidos_2009) as detenidos_normalizado_2009_avg

      FROM vars_socioeco_x_provincia) AS detenidos_normalizado_min_max
,       (SELECT
                max(envejecimiento_normalizado_1991) as envejecimiento_normalizado_1991_max,
        min(envejecimiento_normalizado_1991) as envejecimiento_normalizado_1991_min,
        avg(envejecimiento_1991) as envejecimiento_normalizado_1991_avg
,         max(envejecimiento_normalizado_1992) as envejecimiento_normalizado_1992_max,
        min(envejecimiento_normalizado_1992) as envejecimiento_normalizado_1992_min,
        avg(envejecimiento_1992) as envejecimiento_normalizado_1992_avg
,         max(envejecimiento_normalizado_1993) as envejecimiento_normalizado_1993_max,
        min(envejecimiento_normalizado_1993) as envejecimiento_normalizado_1993_min,
        avg(envejecimiento_1993) as envejecimiento_normalizado_1993_avg
,         max(envejecimiento_normalizado_1994) as envejecimiento_normalizado_1994_max,
        min(envejecimiento_normalizado_1994) as envejecimiento_normalizado_1994_min,
        avg(envejecimiento_1994) as envejecimiento_normalizado_1994_avg
,         max(envejecimiento_normalizado_1995) as envejecimiento_normalizado_1995_max,
        min(envejecimiento_normalizado_1995) as envejecimiento_normalizado_1995_min,
        avg(envejecimiento_1995) as envejecimiento_normalizado_1995_avg
,         max(envejecimiento_normalizado_1996) as envejecimiento_normalizado_1996_max,
        min(envejecimiento_normalizado_1996) as envejecimiento_normalizado_1996_min,
        avg(envejecimiento_1996) as envejecimiento_normalizado_1996_avg
,         max(envejecimiento_normalizado_1997) as envejecimiento_normalizado_1997_max,
        min(envejecimiento_normalizado_1997) as envejecimiento_normalizado_1997_min,
        avg(envejecimiento_1997) as envejecimiento_normalizado_1997_avg
,         max(envejecimiento_normalizado_1998) as envejecimiento_normalizado_1998_max,
        min(envejecimiento_normalizado_1998) as envejecimiento_normalizado_1998_min,
        avg(envejecimiento_1998) as envejecimiento_normalizado_1998_avg
,         max(envejecimiento_normalizado_1999) as envejecimiento_normalizado_1999_max,
        min(envejecimiento_normalizado_1999) as envejecimiento_normalizado_1999_min,
        avg(envejecimiento_1999) as envejecimiento_normalizado_1999_avg
,         max(envejecimiento_normalizado_2000) as envejecimiento_normalizado_2000_max,
        min(envejecimiento_normalizado_2000) as envejecimiento_normalizado_2000_min,
        avg(envejecimiento_2000) as envejecimiento_normalizado_2000_avg
,         max(envejecimiento_normalizado_2001) as envejecimiento_normalizado_2001_max,
        min(envejecimiento_normalizado_2001) as envejecimiento_normalizado_2001_min,
        avg(envejecimiento_2001) as envejecimiento_normalizado_2001_avg
,         max(envejecimiento_normalizado_2002) as envejecimiento_normalizado_2002_max,
        min(envejecimiento_normalizado_2002) as envejecimiento_normalizado_2002_min,
        avg(envejecimiento_2002) as envejecimiento_normalizado_2002_avg
,         max(envejecimiento_normalizado_2003) as envejecimiento_normalizado_2003_max,
        min(envejecimiento_normalizado_2003) as envejecimiento_normalizado_2003_min,
        avg(envejecimiento_2003) as envejecimiento_normalizado_2003_avg
,         max(envejecimiento_normalizado_2004) as envejecimiento_normalizado_2004_max,
        min(envejecimiento_normalizado_2004) as envejecimiento_normalizado_2004_min,
        avg(envejecimiento_2004) as envejecimiento_normalizado_2004_avg
,         max(envejecimiento_normalizado_2005) as envejecimiento_normalizado_2005_max,
        min(envejecimiento_normalizado_2005) as envejecimiento_normalizado_2005_min,
        avg(envejecimiento_2005) as envejecimiento_normalizado_2005_avg
,         max(envejecimiento_normalizado_2006) as envejecimiento_normalizado_2006_max,
        min(envejecimiento_normalizado_2006) as envejecimiento_normalizado_2006_min,
        avg(envejecimiento_2006) as envejecimiento_normalizado_2006_avg
,         max(envejecimiento_normalizado_2007) as envejecimiento_normalizado_2007_max,
        min(envejecimiento_normalizado_2007) as envejecimiento_normalizado_2007_min,
        avg(envejecimiento_2007) as envejecimiento_normalizado_2007_avg
,         max(envejecimiento_normalizado_2008) as envejecimiento_normalizado_2008_max,
        min(envejecimiento_normalizado_2008) as envejecimiento_normalizado_2008_min,
        avg(envejecimiento_2008) as envejecimiento_normalizado_2008_avg
,         max(envejecimiento_normalizado_2009) as envejecimiento_normalizado_2009_max,
        min(envejecimiento_normalizado_2009) as envejecimiento_normalizado_2009_min,
        avg(envejecimiento_2009) as envejecimiento_normalizado_2009_avg
,         max(envejecimiento_normalizado_2010) as envejecimiento_normalizado_2010_max,
        min(envejecimiento_normalizado_2010) as envejecimiento_normalizado_2010_min,
        avg(envejecimiento_2010) as envejecimiento_normalizado_2010_avg
,         max(envejecimiento_normalizado_2011) as envejecimiento_normalizado_2011_max,
        min(envejecimiento_normalizado_2011) as envejecimiento_normalizado_2011_min,
        avg(envejecimiento_2011) as envejecimiento_normalizado_2011_avg

      FROM vars_socioeco_x_provincia) AS envejecimiento_normalizado_min_max
,       (SELECT
                max(pib_normalizado_1999) as pib_normalizado_1999_max,
        min(pib_normalizado_1999) as pib_normalizado_1999_min,
        avg(pib_1999) as pib_normalizado_1999_avg
,         max(pib_normalizado_2000) as pib_normalizado_2000_max,
        min(pib_normalizado_2000) as pib_normalizado_2000_min,
        avg(pib_2000) as pib_normalizado_2000_avg
,         max(pib_normalizado_2001) as pib_normalizado_2001_max,
        min(pib_normalizado_2001) as pib_normalizado_2001_min,
        avg(pib_2001) as pib_normalizado_2001_avg
,         max(pib_normalizado_2002) as pib_normalizado_2002_max,
        min(pib_normalizado_2002) as pib_normalizado_2002_min,
        avg(pib_2002) as pib_normalizado_2002_avg
,         max(pib_normalizado_2003) as pib_normalizado_2003_max,
        min(pib_normalizado_2003) as pib_normalizado_2003_min,
        avg(pib_2003) as pib_normalizado_2003_avg
,         max(pib_normalizado_2004) as pib_normalizado_2004_max,
        min(pib_normalizado_2004) as pib_normalizado_2004_min,
        avg(pib_2004) as pib_normalizado_2004_avg
,         max(pib_normalizado_2005) as pib_normalizado_2005_max,
        min(pib_normalizado_2005) as pib_normalizado_2005_min,
        avg(pib_2005) as pib_normalizado_2005_avg
,         max(pib_normalizado_2006) as pib_normalizado_2006_max,
        min(pib_normalizado_2006) as pib_normalizado_2006_min,
        avg(pib_2006) as pib_normalizado_2006_avg
,         max(pib_normalizado_2007) as pib_normalizado_2007_max,
        min(pib_normalizado_2007) as pib_normalizado_2007_min,
        avg(pib_2007) as pib_normalizado_2007_avg
,         max(pib_normalizado_2008) as pib_normalizado_2008_max,
        min(pib_normalizado_2008) as pib_normalizado_2008_min,
        avg(pib_2008) as pib_normalizado_2008_avg

      FROM vars_socioeco_x_provincia) AS pib_normalizado_min_max
,       (SELECT
                max(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_max,
        min(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_min,
        avg(inmigracion_1999) as inmigracion_normalizado_1999_avg
,         max(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_max,
        min(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_min,
        avg(inmigracion_2000) as inmigracion_normalizado_2000_avg
,         max(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_max,
        min(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_min,
        avg(inmigracion_2001) as inmigracion_normalizado_2001_avg
,         max(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_max,
        min(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_min,
        avg(inmigracion_2002) as inmigracion_normalizado_2002_avg
,         max(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_max,
        min(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_min,
        avg(inmigracion_2003) as inmigracion_normalizado_2003_avg
,         max(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_max,
        min(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_min,
        avg(inmigracion_2004) as inmigracion_normalizado_2004_avg
,         max(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_max,
        min(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_min,
        avg(inmigracion_2005) as inmigracion_normalizado_2005_avg
,         max(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_max,
        min(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_min,
        avg(inmigracion_2006) as inmigracion_normalizado_2006_avg
,         max(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_max,
        min(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_min,
        avg(inmigracion_2007) as inmigracion_normalizado_2007_avg
,         max(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_max,
        min(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_min,
        avg(inmigracion_2008) as inmigracion_normalizado_2008_avg
,         max(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_max,
        min(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_min,
        avg(inmigracion_2009) as inmigracion_normalizado_2009_avg
,         max(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_max,
        min(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_min,
        avg(inmigracion_2010) as inmigracion_normalizado_2010_avg

      FROM vars_socioeco_x_provincia) AS inmigracion_normalizado_min_max
,       (SELECT
                max(saldo_vegetativo_normalizado_1975) as saldo_vegetativo_normalizado_1975_max,
        min(saldo_vegetativo_normalizado_1975) as saldo_vegetativo_normalizado_1975_min,
        avg(saldo_vegetativo_1975) as saldo_vegetativo_normalizado_1975_avg
,         max(saldo_vegetativo_normalizado_1976) as saldo_vegetativo_normalizado_1976_max,
        min(saldo_vegetativo_normalizado_1976) as saldo_vegetativo_normalizado_1976_min,
        avg(saldo_vegetativo_1976) as saldo_vegetativo_normalizado_1976_avg
,         max(saldo_vegetativo_normalizado_1977) as saldo_vegetativo_normalizado_1977_max,
        min(saldo_vegetativo_normalizado_1977) as saldo_vegetativo_normalizado_1977_min,
        avg(saldo_vegetativo_1977) as saldo_vegetativo_normalizado_1977_avg
,         max(saldo_vegetativo_normalizado_1978) as saldo_vegetativo_normalizado_1978_max,
        min(saldo_vegetativo_normalizado_1978) as saldo_vegetativo_normalizado_1978_min,
        avg(saldo_vegetativo_1978) as saldo_vegetativo_normalizado_1978_avg
,         max(saldo_vegetativo_normalizado_1979) as saldo_vegetativo_normalizado_1979_max,
        min(saldo_vegetativo_normalizado_1979) as saldo_vegetativo_normalizado_1979_min,
        avg(saldo_vegetativo_1979) as saldo_vegetativo_normalizado_1979_avg
,         max(saldo_vegetativo_normalizado_1980) as saldo_vegetativo_normalizado_1980_max,
        min(saldo_vegetativo_normalizado_1980) as saldo_vegetativo_normalizado_1980_min,
        avg(saldo_vegetativo_1980) as saldo_vegetativo_normalizado_1980_avg
,         max(saldo_vegetativo_normalizado_1981) as saldo_vegetativo_normalizado_1981_max,
        min(saldo_vegetativo_normalizado_1981) as saldo_vegetativo_normalizado_1981_min,
        avg(saldo_vegetativo_1981) as saldo_vegetativo_normalizado_1981_avg
,         max(saldo_vegetativo_normalizado_1982) as saldo_vegetativo_normalizado_1982_max,
        min(saldo_vegetativo_normalizado_1982) as saldo_vegetativo_normalizado_1982_min,
        avg(saldo_vegetativo_1982) as saldo_vegetativo_normalizado_1982_avg
,         max(saldo_vegetativo_normalizado_1983) as saldo_vegetativo_normalizado_1983_max,
        min(saldo_vegetativo_normalizado_1983) as saldo_vegetativo_normalizado_1983_min,
        avg(saldo_vegetativo_1983) as saldo_vegetativo_normalizado_1983_avg
,         max(saldo_vegetativo_normalizado_1984) as saldo_vegetativo_normalizado_1984_max,
        min(saldo_vegetativo_normalizado_1984) as saldo_vegetativo_normalizado_1984_min,
        avg(saldo_vegetativo_1984) as saldo_vegetativo_normalizado_1984_avg
,         max(saldo_vegetativo_normalizado_1985) as saldo_vegetativo_normalizado_1985_max,
        min(saldo_vegetativo_normalizado_1985) as saldo_vegetativo_normalizado_1985_min,
        avg(saldo_vegetativo_1985) as saldo_vegetativo_normalizado_1985_avg
,         max(saldo_vegetativo_normalizado_1986) as saldo_vegetativo_normalizado_1986_max,
        min(saldo_vegetativo_normalizado_1986) as saldo_vegetativo_normalizado_1986_min,
        avg(saldo_vegetativo_1986) as saldo_vegetativo_normalizado_1986_avg
,         max(saldo_vegetativo_normalizado_1987) as saldo_vegetativo_normalizado_1987_max,
        min(saldo_vegetativo_normalizado_1987) as saldo_vegetativo_normalizado_1987_min,
        avg(saldo_vegetativo_1987) as saldo_vegetativo_normalizado_1987_avg
,         max(saldo_vegetativo_normalizado_1988) as saldo_vegetativo_normalizado_1988_max,
        min(saldo_vegetativo_normalizado_1988) as saldo_vegetativo_normalizado_1988_min,
        avg(saldo_vegetativo_1988) as saldo_vegetativo_normalizado_1988_avg
,         max(saldo_vegetativo_normalizado_1989) as saldo_vegetativo_normalizado_1989_max,
        min(saldo_vegetativo_normalizado_1989) as saldo_vegetativo_normalizado_1989_min,
        avg(saldo_vegetativo_1989) as saldo_vegetativo_normalizado_1989_avg
,         max(saldo_vegetativo_normalizado_1990) as saldo_vegetativo_normalizado_1990_max,
        min(saldo_vegetativo_normalizado_1990) as saldo_vegetativo_normalizado_1990_min,
        avg(saldo_vegetativo_1990) as saldo_vegetativo_normalizado_1990_avg
,         max(saldo_vegetativo_normalizado_1991) as saldo_vegetativo_normalizado_1991_max,
        min(saldo_vegetativo_normalizado_1991) as saldo_vegetativo_normalizado_1991_min,
        avg(saldo_vegetativo_1991) as saldo_vegetativo_normalizado_1991_avg
,         max(saldo_vegetativo_normalizado_1992) as saldo_vegetativo_normalizado_1992_max,
        min(saldo_vegetativo_normalizado_1992) as saldo_vegetativo_normalizado_1992_min,
        avg(saldo_vegetativo_1992) as saldo_vegetativo_normalizado_1992_avg
,         max(saldo_vegetativo_normalizado_1993) as saldo_vegetativo_normalizado_1993_max,
        min(saldo_vegetativo_normalizado_1993) as saldo_vegetativo_normalizado_1993_min,
        avg(saldo_vegetativo_1993) as saldo_vegetativo_normalizado_1993_avg
,         max(saldo_vegetativo_normalizado_1994) as saldo_vegetativo_normalizado_1994_max,
        min(saldo_vegetativo_normalizado_1994) as saldo_vegetativo_normalizado_1994_min,
        avg(saldo_vegetativo_1994) as saldo_vegetativo_normalizado_1994_avg
,         max(saldo_vegetativo_normalizado_1995) as saldo_vegetativo_normalizado_1995_max,
        min(saldo_vegetativo_normalizado_1995) as saldo_vegetativo_normalizado_1995_min,
        avg(saldo_vegetativo_1995) as saldo_vegetativo_normalizado_1995_avg
,         max(saldo_vegetativo_normalizado_1996) as saldo_vegetativo_normalizado_1996_max,
        min(saldo_vegetativo_normalizado_1996) as saldo_vegetativo_normalizado_1996_min,
        avg(saldo_vegetativo_1996) as saldo_vegetativo_normalizado_1996_avg
,         max(saldo_vegetativo_normalizado_1997) as saldo_vegetativo_normalizado_1997_max,
        min(saldo_vegetativo_normalizado_1997) as saldo_vegetativo_normalizado_1997_min,
        avg(saldo_vegetativo_1997) as saldo_vegetativo_normalizado_1997_avg
,         max(saldo_vegetativo_normalizado_1998) as saldo_vegetativo_normalizado_1998_max,
        min(saldo_vegetativo_normalizado_1998) as saldo_vegetativo_normalizado_1998_min,
        avg(saldo_vegetativo_1998) as saldo_vegetativo_normalizado_1998_avg
,         max(saldo_vegetativo_normalizado_1999) as saldo_vegetativo_normalizado_1999_max,
        min(saldo_vegetativo_normalizado_1999) as saldo_vegetativo_normalizado_1999_min,
        avg(saldo_vegetativo_1999) as saldo_vegetativo_normalizado_1999_avg
,         max(saldo_vegetativo_normalizado_2000) as saldo_vegetativo_normalizado_2000_max,
        min(saldo_vegetativo_normalizado_2000) as saldo_vegetativo_normalizado_2000_min,
        avg(saldo_vegetativo_2000) as saldo_vegetativo_normalizado_2000_avg
,         max(saldo_vegetativo_normalizado_2001) as saldo_vegetativo_normalizado_2001_max,
        min(saldo_vegetativo_normalizado_2001) as saldo_vegetativo_normalizado_2001_min,
        avg(saldo_vegetativo_2001) as saldo_vegetativo_normalizado_2001_avg
,         max(saldo_vegetativo_normalizado_2002) as saldo_vegetativo_normalizado_2002_max,
        min(saldo_vegetativo_normalizado_2002) as saldo_vegetativo_normalizado_2002_min,
        avg(saldo_vegetativo_2002) as saldo_vegetativo_normalizado_2002_avg
,         max(saldo_vegetativo_normalizado_2003) as saldo_vegetativo_normalizado_2003_max,
        min(saldo_vegetativo_normalizado_2003) as saldo_vegetativo_normalizado_2003_min,
        avg(saldo_vegetativo_2003) as saldo_vegetativo_normalizado_2003_avg
,         max(saldo_vegetativo_normalizado_2004) as saldo_vegetativo_normalizado_2004_max,
        min(saldo_vegetativo_normalizado_2004) as saldo_vegetativo_normalizado_2004_min,
        avg(saldo_vegetativo_2004) as saldo_vegetativo_normalizado_2004_avg
,         max(saldo_vegetativo_normalizado_2005) as saldo_vegetativo_normalizado_2005_max,
        min(saldo_vegetativo_normalizado_2005) as saldo_vegetativo_normalizado_2005_min,
        avg(saldo_vegetativo_2005) as saldo_vegetativo_normalizado_2005_avg
,         max(saldo_vegetativo_normalizado_2006) as saldo_vegetativo_normalizado_2006_max,
        min(saldo_vegetativo_normalizado_2006) as saldo_vegetativo_normalizado_2006_min,
        avg(saldo_vegetativo_2006) as saldo_vegetativo_normalizado_2006_avg
,         max(saldo_vegetativo_normalizado_2007) as saldo_vegetativo_normalizado_2007_max,
        min(saldo_vegetativo_normalizado_2007) as saldo_vegetativo_normalizado_2007_min,
        avg(saldo_vegetativo_2007) as saldo_vegetativo_normalizado_2007_avg
,         max(saldo_vegetativo_normalizado_2008) as saldo_vegetativo_normalizado_2008_max,
        min(saldo_vegetativo_normalizado_2008) as saldo_vegetativo_normalizado_2008_min,
        avg(saldo_vegetativo_2008) as saldo_vegetativo_normalizado_2008_avg
,         max(saldo_vegetativo_normalizado_2009) as saldo_vegetativo_normalizado_2009_max,
        min(saldo_vegetativo_normalizado_2009) as saldo_vegetativo_normalizado_2009_min,
        avg(saldo_vegetativo_2009) as saldo_vegetativo_normalizado_2009_avg

      FROM vars_socioeco_x_provincia) AS saldo_vegetativo_normalizado_min_max
,       (SELECT
                max(matriculaciones_normalizado_1997) as matriculaciones_normalizado_1997_max,
        min(matriculaciones_normalizado_1997) as matriculaciones_normalizado_1997_min,
        avg(matriculaciones_1997) as matriculaciones_normalizado_1997_avg
,         max(matriculaciones_normalizado_1998) as matriculaciones_normalizado_1998_max,
        min(matriculaciones_normalizado_1998) as matriculaciones_normalizado_1998_min,
        avg(matriculaciones_1998) as matriculaciones_normalizado_1998_avg
,         max(matriculaciones_normalizado_1999) as matriculaciones_normalizado_1999_max,
        min(matriculaciones_normalizado_1999) as matriculaciones_normalizado_1999_min,
        avg(matriculaciones_1999) as matriculaciones_normalizado_1999_avg
,         max(matriculaciones_normalizado_2000) as matriculaciones_normalizado_2000_max,
        min(matriculaciones_normalizado_2000) as matriculaciones_normalizado_2000_min,
        avg(matriculaciones_2000) as matriculaciones_normalizado_2000_avg
,         max(matriculaciones_normalizado_2001) as matriculaciones_normalizado_2001_max,
        min(matriculaciones_normalizado_2001) as matriculaciones_normalizado_2001_min,
        avg(matriculaciones_2001) as matriculaciones_normalizado_2001_avg
,         max(matriculaciones_normalizado_2002) as matriculaciones_normalizado_2002_max,
        min(matriculaciones_normalizado_2002) as matriculaciones_normalizado_2002_min,
        avg(matriculaciones_2002) as matriculaciones_normalizado_2002_avg
,         max(matriculaciones_normalizado_2003) as matriculaciones_normalizado_2003_max,
        min(matriculaciones_normalizado_2003) as matriculaciones_normalizado_2003_min,
        avg(matriculaciones_2003) as matriculaciones_normalizado_2003_avg
,         max(matriculaciones_normalizado_2004) as matriculaciones_normalizado_2004_max,
        min(matriculaciones_normalizado_2004) as matriculaciones_normalizado_2004_min,
        avg(matriculaciones_2004) as matriculaciones_normalizado_2004_avg
,         max(matriculaciones_normalizado_2005) as matriculaciones_normalizado_2005_max,
        min(matriculaciones_normalizado_2005) as matriculaciones_normalizado_2005_min,
        avg(matriculaciones_2005) as matriculaciones_normalizado_2005_avg
,         max(matriculaciones_normalizado_2006) as matriculaciones_normalizado_2006_max,
        min(matriculaciones_normalizado_2006) as matriculaciones_normalizado_2006_min,
        avg(matriculaciones_2006) as matriculaciones_normalizado_2006_avg
,         max(matriculaciones_normalizado_2007) as matriculaciones_normalizado_2007_max,
        min(matriculaciones_normalizado_2007) as matriculaciones_normalizado_2007_min,
        avg(matriculaciones_2007) as matriculaciones_normalizado_2007_avg
,         max(matriculaciones_normalizado_2008) as matriculaciones_normalizado_2008_max,
        min(matriculaciones_normalizado_2008) as matriculaciones_normalizado_2008_min,
        avg(matriculaciones_2008) as matriculaciones_normalizado_2008_avg
,         max(matriculaciones_normalizado_2009) as matriculaciones_normalizado_2009_max,
        min(matriculaciones_normalizado_2009) as matriculaciones_normalizado_2009_min,
        avg(matriculaciones_2009) as matriculaciones_normalizado_2009_avg

      FROM vars_socioeco_x_provincia) AS matriculaciones_normalizado_min_max
,       (SELECT
                max(edad_media_normalizado_2000) as edad_media_normalizado_2000_max,
        min(edad_media_normalizado_2000) as edad_media_normalizado_2000_min,
        avg(edad_media_2000) as edad_media_normalizado_2000_avg
,         max(edad_media_normalizado_2001) as edad_media_normalizado_2001_max,
        min(edad_media_normalizado_2001) as edad_media_normalizado_2001_min,
        avg(edad_media_2001) as edad_media_normalizado_2001_avg
,         max(edad_media_normalizado_2002) as edad_media_normalizado_2002_max,
        min(edad_media_normalizado_2002) as edad_media_normalizado_2002_min,
        avg(edad_media_2002) as edad_media_normalizado_2002_avg
,         max(edad_media_normalizado_2003) as edad_media_normalizado_2003_max,
        min(edad_media_normalizado_2003) as edad_media_normalizado_2003_min,
        avg(edad_media_2003) as edad_media_normalizado_2003_avg
,         max(edad_media_normalizado_2004) as edad_media_normalizado_2004_max,
        min(edad_media_normalizado_2004) as edad_media_normalizado_2004_min,
        avg(edad_media_2004) as edad_media_normalizado_2004_avg
,         max(edad_media_normalizado_2005) as edad_media_normalizado_2005_max,
        min(edad_media_normalizado_2005) as edad_media_normalizado_2005_min,
        avg(edad_media_2005) as edad_media_normalizado_2005_avg
,         max(edad_media_normalizado_2006) as edad_media_normalizado_2006_max,
        min(edad_media_normalizado_2006) as edad_media_normalizado_2006_min,
        avg(edad_media_2006) as edad_media_normalizado_2006_avg
,         max(edad_media_normalizado_2007) as edad_media_normalizado_2007_max,
        min(edad_media_normalizado_2007) as edad_media_normalizado_2007_min,
        avg(edad_media_2007) as edad_media_normalizado_2007_avg
,         max(edad_media_normalizado_2008) as edad_media_normalizado_2008_max,
        min(edad_media_normalizado_2008) as edad_media_normalizado_2008_min,
        avg(edad_media_2008) as edad_media_normalizado_2008_avg
,         max(edad_media_normalizado_2009) as edad_media_normalizado_2009_max,
        min(edad_media_normalizado_2009) as edad_media_normalizado_2009_min,
        avg(edad_media_2009) as edad_media_normalizado_2009_avg
,         max(edad_media_normalizado_2010) as edad_media_normalizado_2010_max,
        min(edad_media_normalizado_2010) as edad_media_normalizado_2010_min,
        avg(edad_media_2010) as edad_media_normalizado_2010_avg

      FROM vars_socioeco_x_provincia) AS edad_media_normalizado_min_max

    SQL
    ),
    11 => (<<-SQL
    SELECT       inmigracion_normalizado_min_max.*
,       edad_media_normalizado_min_max.*

    FROM       (SELECT
                max(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_max,
        min(inmigracion_normalizado_1999) as inmigracion_normalizado_1999_min,
        avg(inmigracion_1999) as inmigracion_normalizado_1999_avg
,         max(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_max,
        min(inmigracion_normalizado_2000) as inmigracion_normalizado_2000_min,
        avg(inmigracion_2000) as inmigracion_normalizado_2000_avg
,         max(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_max,
        min(inmigracion_normalizado_2001) as inmigracion_normalizado_2001_min,
        avg(inmigracion_2001) as inmigracion_normalizado_2001_avg
,         max(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_max,
        min(inmigracion_normalizado_2002) as inmigracion_normalizado_2002_min,
        avg(inmigracion_2002) as inmigracion_normalizado_2002_avg
,         max(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_max,
        min(inmigracion_normalizado_2003) as inmigracion_normalizado_2003_min,
        avg(inmigracion_2003) as inmigracion_normalizado_2003_avg
,         max(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_max,
        min(inmigracion_normalizado_2004) as inmigracion_normalizado_2004_min,
        avg(inmigracion_2004) as inmigracion_normalizado_2004_avg
,         max(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_max,
        min(inmigracion_normalizado_2005) as inmigracion_normalizado_2005_min,
        avg(inmigracion_2005) as inmigracion_normalizado_2005_avg
,         max(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_max,
        min(inmigracion_normalizado_2006) as inmigracion_normalizado_2006_min,
        avg(inmigracion_2006) as inmigracion_normalizado_2006_avg
,         max(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_max,
        min(inmigracion_normalizado_2007) as inmigracion_normalizado_2007_min,
        avg(inmigracion_2007) as inmigracion_normalizado_2007_avg
,         max(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_max,
        min(inmigracion_normalizado_2008) as inmigracion_normalizado_2008_min,
        avg(inmigracion_2008) as inmigracion_normalizado_2008_avg
,         max(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_max,
        min(inmigracion_normalizado_2009) as inmigracion_normalizado_2009_min,
        avg(inmigracion_2009) as inmigracion_normalizado_2009_avg
,         max(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_max,
        min(inmigracion_normalizado_2010) as inmigracion_normalizado_2010_min,
        avg(inmigracion_2010) as inmigracion_normalizado_2010_avg

      FROM vars_socioeco_x_municipio) AS inmigracion_normalizado_min_max
,       (SELECT
                max(edad_media_normalizado_2000) as edad_media_normalizado_2000_max,
        min(edad_media_normalizado_2000) as edad_media_normalizado_2000_min,
        avg(edad_media_2000) as edad_media_normalizado_2000_avg
,         max(edad_media_normalizado_2001) as edad_media_normalizado_2001_max,
        min(edad_media_normalizado_2001) as edad_media_normalizado_2001_min,
        avg(edad_media_2001) as edad_media_normalizado_2001_avg
,         max(edad_media_normalizado_2002) as edad_media_normalizado_2002_max,
        min(edad_media_normalizado_2002) as edad_media_normalizado_2002_min,
        avg(edad_media_2002) as edad_media_normalizado_2002_avg
,         max(edad_media_normalizado_2003) as edad_media_normalizado_2003_max,
        min(edad_media_normalizado_2003) as edad_media_normalizado_2003_min,
        avg(edad_media_2003) as edad_media_normalizado_2003_avg
,         max(edad_media_normalizado_2004) as edad_media_normalizado_2004_max,
        min(edad_media_normalizado_2004) as edad_media_normalizado_2004_min,
        avg(edad_media_2004) as edad_media_normalizado_2004_avg
,         max(edad_media_normalizado_2005) as edad_media_normalizado_2005_max,
        min(edad_media_normalizado_2005) as edad_media_normalizado_2005_min,
        avg(edad_media_2005) as edad_media_normalizado_2005_avg
,         max(edad_media_normalizado_2006) as edad_media_normalizado_2006_max,
        min(edad_media_normalizado_2006) as edad_media_normalizado_2006_min,
        avg(edad_media_2006) as edad_media_normalizado_2006_avg
,         max(edad_media_normalizado_2007) as edad_media_normalizado_2007_max,
        min(edad_media_normalizado_2007) as edad_media_normalizado_2007_min,
        avg(edad_media_2007) as edad_media_normalizado_2007_avg
,         max(edad_media_normalizado_2008) as edad_media_normalizado_2008_max,
        min(edad_media_normalizado_2008) as edad_media_normalizado_2008_min,
        avg(edad_media_2008) as edad_media_normalizado_2008_avg
,         max(edad_media_normalizado_2009) as edad_media_normalizado_2009_max,
        min(edad_media_normalizado_2009) as edad_media_normalizado_2009_min,
        avg(edad_media_2009) as edad_media_normalizado_2009_avg
,         max(edad_media_normalizado_2010) as edad_media_normalizado_2010_max,
        min(edad_media_normalizado_2010) as edad_media_normalizado_2010_min,
        avg(edad_media_2010) as edad_media_normalizado_2010_avg

      FROM vars_socioeco_x_municipio) AS edad_media_normalizado_min_max
    SQL
    )
  }

  queries[z]
end

# puts
# puts max_min_vars_query(11)
# puts

[6, 7, 11].each do |z|
  File.open("#{ENV['HOME']}/Desktop/max_min_avg_#{z}.json", 'w') do |file|
    vars = {}
    cartodb.query(queries_by_zoom(z)).rows.first.each do |key, value|
      vars[key] = value.to_f.round(2)
    end
    file.write(vars.to_json)
  end
end