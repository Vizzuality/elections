function normalizePartyName(name) {
  if (name === undefined) {
    return;
  }
  var slashPos = name.indexOf("/");
  var pos = (slashPos == -1) ? name.length : slashPos;
  return name.toLowerCase().replace("-", "_").substring(0, pos);
}

function normalizeBarWidth(bar_width) {
  var bar_min_size = 7;
  return (bar_width < bar_min_size) ? bar_min_size : bar_width;
}


var parties = ["psoe", "pp", "iu", "ap", "indep", "pa", "bng", "pdp", "erc_am", "esquerra_am", "erc", "hb", "ciu", "cds", "par", "eaj_pnv", "ea", "prc", "pr", "uv"];


var normalization = {
  'paro': 'paro_epa_normalizado',
  'envejecimiento': 'envejecimiento_normalizado',
  'edad media': 'edad_media_normalizado',
  'inmigracion': 'inmigracion_normalizado',
  'saldo vegetativo': 'saldo_vegetativo_normalizado',
  'pib': 'pib_normalizado',
  'salario': 'salario_medio_normalizado',
  'secundaria acabada': 'secundaria_acabada_normalizado',
  'consumo tv': 'audiencia_diaria_tv_normalizado',
  'consumo prensa': 'prensa_diaria_normalizado',
  'penetracion internet': 'penetracion_internet_normalizado',
  'matriculaciones': 'matriculaciones_normalizado',
  'detenidos': 'detenidos_normalizado',
  'jovenes parados': 'jovenes_parados_normalizado',
  'parados larga duracion': 'parados_larga_duracion_normalizado'
};


var resolucion = {
  'paro': 6,
  'envejecimiento': 6,
  'edad media': 6,
  'saldo vegetativo': 6,
  'pib': 6,
  'salario': 6
};


var custom_map_style = [{featureType:"administrative.country",elementType:"all",stylers:[{saturation:-100},{visibility:"off"}]},{featureType:"administrative.province",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"all",stylers:[{lightness:7},{saturation:-91}]},{featureType:"all",elementType:"all",stylers:[]}];

var tooltipInfo = {
  "Envejecimiento" : {
    content: "Desviación respecto a la media del porcentaje de personas mayores de 65 años.",
    right: "más mayores",
    left: "más jóvenes",
    legendTop: "Más % de mayores de 65 años",
    legendBottom:"Menos % de mayores de 65 años"
  },
  "% Inmigración" : {
    content: "Desviación respecto a la media del número de inmigrantes por habitante.",
    left: "menos inmigr.",
    right: "más inmigr.",
    legendTop: "Más % de inmigración",
    legendBottom:"Menos % de inmigración"
  },
  "Tasa de paro" : {
    content: "Desviación respecto a la media de la tasa de paro EPA.",
    left: "menos parados",
    right: "más parados",
    legendTop: "Más % paro",
    legendBottom:"Menos % paro"
  },
  "PIB per cápita" : {
    content: "Desviación respecto a la media del producto interior bruto por habitante.",
    left: "menos PIB",
    right: "más PIB",
    legendTop: "Más PIB per cápita",
    legendBottom:"Menos PIB per cápita"
  },
  "Matriculaciones" : {
    content: "Desviación respecto a la media del número de vehículos matriculados.",
    left: "menos vehic.",
    right: "más vehic.",
    legendTop: "Más vehículos",
    legendBottom:"Menos vehículos"
  },
  "Jóvenes parados" : {
    content: "Desviación sobre la media del porcentaje de jóvenes parados de larga duración.",
    left: "menos paro",
    right: "más paro",
    legendTop: "Más jóvenes parados",
    legendBottom:"Menos jóvenes parados"
  },
  "Parados larga duración" : {
    content: "Desviación sobre la media del porcentaje de parados de larga duración.",
    left: "menos paro",
    right: "más paro",
    legendTop: "Más parados",
    legendBottom:"Menos parados"
  },
  "Edad media" : {
    content: "Desviación de la edad media respecto a la media de edad nacional.",
    right: "más mayores",
    left: "más jóvenes",
    legendTop: "Más edad",
    legendBottom:"Menos edad"
  },
  "Saldo Vegetativo" : {
    content: "Desviación respecto a la media del crecimiento de la población.",
    left: "crece poco",
    right: "crece mucho",
    legendTop: "Mayor crecimiento",
    legendBottom:"Menor crecimiento"
  },
  "Salario medio" : {
    content: "Desviación respecto a la media del salario medio por habitante.",
    left: "sueldos + bajos",
    right: "sueldos + altos",
    legendTop: "Sueldos más altos",
    legendBottom:"Sueldos más bajos"
  },
  "Estudios acabados" : {
    content: "Desviación respecto a la media del porcentaje de personas con estudios secundarios acabados.",
    left: "menos habit.",
    right: "más habit.",
    legendTop: "Más habitantes",
    legendBottom:"Menos habitantes"
  },
  "Consumo TV" : {
    content: "Desviación respecto a la media del consumo de tv.",
    left: "menos tv",
    right: "más tv",
    legendTop: "Más consumo tv",
    legendBottom:"Menos consumo tv"
  },
  "Penetr. internet" : {
    content: "Desviación respecto a la media del porcentaje de personas acceso a internet",
    left: "menor acceso",
    right: "mayor acceso",
    legendTop: "Más acceso a internet",
    legendBottom:"Menos acceso a internet"
  },
  "Consumo prensa" : {
    content: "Desviación respecto a la media del consumo de prensa.",
    left: "menos prensa",
    right: "más prensa",
    legendTop: "Más consumo prensa",
    legendBottom:"Menos consumo prensa"
  },
  "Detenidos" : {
    content: "Desviación respecto a la media de detenidos por cada mil habitantes.",
    left: "menos detenidos",
    right: "más detenidos",
    legendTop: "Más detenidos",
    legendBottom:"Menos detenidos"
  }
};

var textInfoWindow = {
  envejecimiento_normalizado : {
    before_negative: "Aquí hay un ",
    after_negative: "% menos de personas mayores de 65 años, que en el resto de España",
    before_positive: "Aquí hay un ",
    after_positive: "% más de personas mayores de 65 años, que en el resto de España"
  },
  paro_epa_normalizado : {
    before_negative: "La tasa de paro se encuentra a un ",
    after_negative: "% por debajo de la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: "% por encima de la media nacional <strong>(<%= media %>)</strong>."
  },
  paro_normalizado : {
    before_negative: "La tasa de paro se encuentra a un ",
    after_negative: "% por debajo de la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: "% por encima de la media nacional <strong>(<%= media %>)</strong>."
  },
  pib_normalizado : {
    before_negative: "El PIB per cápita aquí es un ",
    after_negative: "% más bajo que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "El PIB per cápita aquí es un ",
    after_positive: "% más alto que la media nacional <strong>(<%= media %>)</strong>."
  },
  edad_media_normalizado : {
    before_negative: "Su población es ",
    after_negative: " años más jóven que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Su población es ",
    after_positive: " años más mayor que la media nacional <strong>(<%= media %>)</strong>."
  },
  inmigracion_normalizado : {
    before_negative: "El porcentaje de inmigración en este municipio está ",
    after_negative: "% por debajo de la media <strong>(<%= media %>)</strong>.",
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  saldo_vegetativo_normalizado : {
    before_negative: "El crecimiento de la población está un ",
    after_negative: "% por debajo de la media <strong>(<%= media %>)</strong>.",
    before_positive: "El crecimiento de la población está un ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  salario_medio_normalizado : {
    before_negative: "El salario medio aquí está un ",
    after_negative: "% por debajo de la media <strong>(<%= media %>)</strong>.",
    before_positive: "El salario medio aquí está un ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  secundaria_acabada_normalizado: {
    before_negative: "Un ",
    after_negative: "% menos que la media nacional <strong>(<%= media %>)</strong>, tiene los estudios secundarios terminados",
    before_positive: "Un ",
    after_positive: "% más que la media nacional <strong>(<%= media %>)</strong>, tiene los estudios secundarios terminados"
  },
  penetracion_internet_normalizado: {
    before_negative: "Un ",
    after_negative: "% menos que la media <strong>(<%= media %>)</strong>, tiene acceso a internet aquí",
    before_positive: "Un ",
    after_positive: "% más que la media <strong>(<%= media %>)</strong>, tiene acceso a internet aquí"
  },
  audiencia_diaria_tv_normalizado : {
    before_negative: "Su población consume un ",
    after_negative: "% menos de televisión que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Su población consume un ",
    after_positive: "  más de televisión que la media nacional <strong>(<%= media %>)</strong>."
  },
  prensa_diaria_normalizado : {
    before_negative: "Su población consume un ",
    after_negative: "% menos de radio que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_positive: "% más de radio que la media nacional <strong>(<%= media %>)</strong>."
  },
  matriculaciones_normalizado : {
    before_negative: " ",
    after_negative: "% <strong>(<%= media %>)</strong>.",
    before_positive: " ",
    after_positive: "% <strong>(<%= media %>)</strong>."
  },
  detenidos_normalizado : {
    before_negative: " ",
    after_negative: "% <strong>(<%= media %>)</strong>.",
    before_positive: " ",
    after_positive: "% <strong>(<%= media %>)</strong>."
  },
  jovenes_parados_normalizado: {
    before_negative: " ",
    after_negative: "% <strong>(<%= media %>)</strong>",
    before_positive: " ",
    after_positive: "% <strong>(<%= media %>)</strong>"
  },
  parados_larga_duracion_normalizado: {
    before_negative: " ",
    after_negative: "% <strong>(<%= media %>)</strong>",
    before_positive: " ",
    after_positive: "% <strong>(<%= media %>)</strong>"
  }
};


var explanationContent = {
  "Edad Media" : {
    htmlContent: "<h1>Edad media de la población</h1><p class='rango'>Datos disponibles a nivel de municipio entre 2000 y 2010</p><p>Cálculo de la edad media de la población a partir de los grupos quinquenales de distribución de edad del Instituto Nacional de Estadística, considerando el valor medio para cada tramo.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft20%2Fe245&file=inebase&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Envejecimiento" : {
    htmlContent: "<h1>Envejecimiento de la población</h1><p class='rango'>Datos disponibles a nivel provincial entre 1991 y 2011</p><p>Proporción existente entre el número de personas mayores y el de niños para una población determinada. Se calcula como el número de adultos mayores de 65 años por cada 100 niños menores de 15.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?per=12&type=db&divi=IDB&idtab=57'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Porcentaje de inmigración" : {
    htmlContent: "<h1>Porcentaje de inmigración</h1><p class='rango'>Datos disponibles a nivel de municipio entre 1999 y 2010</p><p>X.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft20%2Fe245%2F&file=inebase&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Saldo vegetativo" : {
    htmlContent: "<h1>Saldo vegetativo</h1><p class='rango'>Datos disponibles a nivel de provincia entre 1987 y 2009</p><p>Indicador demográfico básico que expresa el crecimiento natural de una población, calculado como el número de nacimientos menos el de defunciones por cada mil habitantes.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?per=12&type=db&divi=IDB&idtab=51'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Tasa de paro" : {
    htmlContent: "<h1>Tasa de paro según la encuesta de población activa</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 2005 y 2011</p><p>Porcentaje de personas sobre la población activa que se encuentran en situación de paro.</p><p class='fuente'>Puede acceder a los datos en bruto en el <a href='http://www.ine.es/jaxi/menu.do?type=pcaxis&path=/t22/e308_mnu&file=inebase&N=&L=0'>Instituto Nacional de Estadística</a></p>"
  },
  "Parados larga duración" : {
    htmlContent: "<h1>Parados de larga duración</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 1991 y 2009</p><p>Personas desempleadas durante 12 meses o más, en porcentaje sobre la población activa.</p><p class='fuente'>Puede acceder a los datos en bruto en la <a href='http://www.ine.es/daco/daco42/sociales10/cohe-prov.xls'>web del Instituto Nacional de Estadística</a></p>"
  },
  "Jóvenes parados larga duración" : {
    htmlContent: "<h1>Jóvenes parados de larga duración</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 1991 y 2009</p><p>Población entre los 16 y los 29 años en situación de desempleo durante 12 meses o más, en porcentaje sobre la población del mismo rango de edad.</p><p class='fuente'>Puede acceder a los datos en bruto en la <a href='http://www.ine.es/daco/daco42/sociales10/cohe-prov.xls'>web del Instituto Nacional de Estadística</a></p>"
  },
  "PIB per cápita" : {
    htmlContent: "<h1>PIB per cápita</h1><p class='rango'>Datos disponibles a nivel de provincia entre 1999 y 2008</p><p>Producto Interior Bruto a precios de mercado. Los valores correspondientes a los años 2007-2010 son estimaciones.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/cre00/serieh/cre00_sh.htm'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Salario medio" : {
    htmlContent: "<h1>Salario medio</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 1995 y 2009</p><p>Salario medio calculado mediante la división de la remuneración total de los asalariados entre el número total de asalariados.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/cre00/serieh/cre00_sh.htm'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Matriculaciones" : {
    htmlContent: "<h1>Matriculaciones de turismos y motocicletas</h1><p class='rango'>Datos disponibles a nivel de provincia entre 1997 y 2009</p><p>Matriculaciones totales de turismos y motocicletas, en número de vehículos.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.dgt.es/portal/es/seguridad_vial/estadistica/matriculaciones_definitivas/provincias_tipo_vehiculo/'>la web de la Dirección General de Tráfico</a></p>"
  },
  "Estudios superiores" : {
    htmlContent: "<h1>Población con estudios superiores</h1><p class='rango'>Datos disponibles a nivel de provincia entre 2004 y 2011</p><p>Porcentaje de la población con más de 16 años con estudios superiores.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/sociales10/educa-prov.xls'>la web del Ministerio de Educación y Ciencia</a></p>"
  },
  "Consumo de TV" : {
    htmlContent: "<h1>Consumo de televisión</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 1997 y 2009</p><p>Audiencia acumulada diaria como porcentaje sobre la población mayor de 14 años. Dato proporcionado por el Instituto Nacional de Estadística a partir de un estudio de AIMC.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?path=/t12/a110/a01/l0/&file=o40044.px&type=pcaxis&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Consumo de prensa" : {
    htmlContent: "<h1>Consumo de prensa</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 2000 y 2009</p><p>Audiencia acumulada diaria como porcentaje sobre la población mayor de 14 años. Dato proporcionado por el Instituto Nacional de Estadística a partir de un estudio de AIMC.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?path=/t12/a110/a01/l0/&file=o40022.px&type=pcaxis&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Penetración de internet" : {
    htmlContent: "<h1>Penetración de internet</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre 2004 y 2010</p><p>Indicador de la penetración de Internet en la población española.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.aimc.es/-Audiencia-de-Internet-en-el-EGM-.html'>el Estudio General de Medios de la AIMC de Octubre / Noviembre de 2010.</a></p>"
  },
  "Detenidos" : {
    htmlContent: "<h1>Detenidos</h1><p class='rango'>Datos disponibles a nivel de provincia entre 1993 y 2009</p><p>Número de personas detenidas por la Guardia Civil y la Policía Nacional por cada mil habitantes.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/sociales10/cohe-prov.xls'>la web del Instituto Nacional de Estadística</a></p>"
  }
};

var table_zoom = {
  12:'gadm4',
  11:'gadm4',
  9:'gadm2',
  8:'gadm2',
  7:'gadm2',
  6:'gadm1'
};

var procesos_electorales = {
  "1987":"68","1988":"68","1989":"68","1990":"68",
  "1991":"69","1992":"69","1993":"69","1994":"69",
  "1995":"70","1996":"70","1997":"70","1998":"70",
  "1999":"71","2000":"71","2001":"71","2002":"71",
  "2003":"72","2004":"72","2005":"72","2006":"72",
  "2007":"73","2008":"73","2009":"73","2010":"73",
  "2011":"74"
};

var graph_hack_year = {
  "1987":"1987","1988":"1987","1989":"1987","1990":"1987",
  "1991":"1991","1992":"1991","1993":"1991","1994":"1991",
  "1995":"1995","1996":"1995","1997":"1995","1998":"1995",
  "1999":"1999","2000":"1999","2001":"1999","2002":"1999",
  "2003":"2003","2004":"2003","2005":"2003","2006":"2003",
  "2007":"2007","2008":"2007","2009":"2007","2010":"2007",
  "2011":"74"
};



function replaceWeirdCharacters(string) {
  string = string.replace(/[àáâãäåāă]/,   'a');
  string = string.replace(/æ/g,            'ae');
  string = string.replace(/[ďđ]/g,          'd');
  string = string.replace(/[çćčĉċ]/g,       'c');
  string = string.replace(/[èéêëēęěĕė]/g,   'e');
  string = string.replace(/ƒ/g,             'f');
  string = string.replace(/[ĝğġģ]/g,        'g');
  string = string.replace(/[ĥħ]/g,          'h');
  string = string.replace(/[ììíîïīĩĭ]/g,    'i');
  string = string.replace(/[įıĳĵ]/g,        'j');
  string = string.replace(/[ķĸ]/g,          'k');
  string = string.replace(/[łľĺļŀ]/g,       'l');
  string = string.replace(/[ñńňņŉŋ]/g,      'n');
  string = string.replace(/[òóôõöøōőŏŏ]/g,  'o');
  string = string.replace(/œ/g,            'oe');
  string = string.replace(/ą/g,             'q');
  string = string.replace(/[ŕřŗ]/g,         'r');
  string = string.replace(/[śšşŝș]/g,       's');
  string = string.replace(/[ťţŧț]/g,        't');
  string = string.replace(/[ùúûüūůűŭũų]/g,  'u');
  string = string.replace(/ŵ/g,             'w');
  string = string.replace(/[ýÿŷ]/g,         'y');
  string = string.replace(/[žżź]/g,         'z');
  string = string.replace(/[ÀÁÂÃÄÅĀĂ]/i,    'A');
  string = string.replace(/Æ/i,            'AE');
  string = string.replace(/[ĎĐ]/i,          'D');
  string = string.replace(/[ÇĆČĈĊ]/i,       'C');
  string = string.replace(/[ÈÉÊËĒĘĚĔĖ]/i,   'E');
  string = string.replace(/Ƒ/i,             'F');
  string = string.replace(/[ĜĞĠĢ]/i,        'G');
  string = string.replace(/[ĤĦ]/i,          'H');
  string = string.replace(/[ÌÌÍÎÏĪĨĬ]/i,    'I');
  string = string.replace(/[ĲĴ]/i,          'J');
  string = string.replace(/[Ķĸ]/i,          'J');
  string = string.replace(/[ŁĽĹĻĿ]/i,       'L');
  string = string.replace(/[ÑŃŇŅŉŊ]/i,      'M');
  string = string.replace(/[ÒÓÔÕÖØŌŐŎŎ]/i,  'N');
  string = string.replace(/Œ/i,            'OE');
  string = string.replace(/Ą/i,             'Q');
  string = string.replace(/[ŔŘŖ]/i,         'R');
  string = string.replace(/[ŚŠŞŜȘ]/i,       'S');
  string = string.replace(/[ŤŢŦȚ]/i,        'T');
  string = string.replace(/[ÙÚÛÜŪŮŰŬŨŲ]/i,  'U');
  string = string.replace(/Ŵ/i,             'W');
  string = string.replace(/[ÝŸŶ]/i,         'Y');
  string = string.replace(/[ŽŻŹ]/i,         'Z');
  string = string.replace(/ /g,             '_');
  string = string.replace(/'/g,             '"');
  string = string.replace(/\//g,             '');
  return string.toLowerCase();
}



var max_min={'provincias':{"detenidos_normalizado_1993_max":522.3,"detenidos_normalizado_1993_min":-87.49,"detenidos_normalizado_1993_avg":5.28,"detenidos_normalizado_1994_max":589.87,"detenidos_normalizado_1994_min":-94.08,"detenidos_normalizado_1994_avg":5.4,"detenidos_normalizado_1995_max":633.04,"detenidos_normalizado_1995_min":-97.13,"detenidos_normalizado_1995_avg":5.57,"detenidos_normalizado_1996_max":644.76,"detenidos_normalizado_1996_min":-97.57,"detenidos_normalizado_1996_avg":5.77,"detenidos_normalizado_1997_max":601.23,"detenidos_normalizado_1997_min":-98.05,"detenidos_normalizado_1997_avg":5.65,"detenidos_normalizado_1998_max":504.91,"detenidos_normalizado_1998_min":-97.94,"detenidos_normalizado_1998_avg":5.33,"detenidos_normalizado_1999_max":582.24,"detenidos_normalizado_1999_min":-93.25,"detenidos_normalizado_1999_avg":5.77,"detenidos_normalizado_2000_max":486.18,"detenidos_normalizado_2000_min":-91.5,"detenidos_normalizado_2000_avg":5.76,"detenidos_normalizado_2001_max":464.71,"detenidos_normalizado_2001_min":-91.17,"detenidos_normalizado_2001_avg":5.77,"detenidos_normalizado_2002_max":537.23,"detenidos_normalizado_2002_min":-94.05,"detenidos_normalizado_2002_avg":5.88,"detenidos_normalizado_2003_max":431.27,"detenidos_normalizado_2003_min":-92.62,"detenidos_normalizado_2003_avg":5.28,"detenidos_normalizado_2004_max":365.69,"detenidos_normalizado_2004_min":-95.34,"detenidos_normalizado_2004_avg":5.8,"detenidos_normalizado_2005_max":349.92,"detenidos_normalizado_2005_min":-95.3,"detenidos_normalizado_2005_avg":5.96,"detenidos_normalizado_2006_max":409.82,"detenidos_normalizado_2006_min":-94.52,"detenidos_normalizado_2006_avg":6.02,"detenidos_normalizado_2007_max":392.33,"detenidos_normalizado_2007_min":-53.37,"detenidos_normalizado_2007_avg":6.76,"detenidos_normalizado_2008_max":413.86,"detenidos_normalizado_2008_min":-56.21,"detenidos_normalizado_2008_avg":7.86,"detenidos_normalizado_2009_max":376.14,"detenidos_normalizado_2009_min":-52.36,"detenidos_normalizado_2009_avg":8.04,"envejecimiento_normalizado_1991_max":64.73,"envejecimiento_normalizado_1991_min":-42.71,"envejecimiento_normalizado_1991_avg":76.97,"envejecimiento_normalizado_1992_max":66.41,"envejecimiento_normalizado_1992_min":-46.08,"envejecimiento_normalizado_1992_avg":81.34,"envejecimiento_normalizado_1993_max":68.68,"envejecimiento_normalizado_1993_min":-49.96,"envejecimiento_normalizado_1993_avg":86.01,"envejecimiento_normalizado_1994_max":70.31,"envejecimiento_normalizado_1994_min":-54.17,"envejecimiento_normalizado_1994_avg":91.01,"envejecimiento_normalizado_1995_max":75.37,"envejecimiento_normalizado_1995_min":-58.41,"envejecimiento_normalizado_1995_avg":96.27,"envejecimiento_normalizado_1996_max":82.18,"envejecimiento_normalizado_1996_min":-62.89,"envejecimiento_normalizado_1996_avg":101.77,"envejecimiento_normalizado_1997_max":88.45,"envejecimiento_normalizado_1997_min":-67.39,"envejecimiento_normalizado_1997_avg":107.3,"envejecimiento_normalizado_1998_max":96.03,"envejecimiento_normalizado_1998_min":-71.79,"envejecimiento_normalizado_1998_avg":112.66,"envejecimiento_normalizado_1999_max":102.25,"envejecimiento_normalizado_1999_min":-76.2,"envejecimiento_normalizado_1999_avg":117.77,"envejecimiento_normalizado_2000_max":109.4,"envejecimiento_normalizado_2000_min":-79.99,"envejecimiento_normalizado_2000_avg":122.35,"envejecimiento_normalizado_2001_max":116.27,"envejecimiento_normalizado_2001_min":-83.01,"envejecimiento_normalizado_2001_avg":125.96,"envejecimiento_normalizado_2002_max":123.18,"envejecimiento_normalizado_2002_min":-85.16,"envejecimiento_normalizado_2002_avg":128.9,"envejecimiento_normalizado_2003_max":129.62,"envejecimiento_normalizado_2003_min":-84.29,"envejecimiento_normalizado_2003_avg":130.0,"envejecimiento_normalizado_2004_max":133.7,"envejecimiento_normalizado_2004_min":-84.03,"envejecimiento_normalizado_2004_avg":130.65,"envejecimiento_normalizado_2005_max":137.64,"envejecimiento_normalizado_2005_min":-83.44,"envejecimiento_normalizado_2005_avg":131.04,"envejecimiento_normalizado_2006_max":138.34,"envejecimiento_normalizado_2006_min":-81.82,"envejecimiento_normalizado_2006_avg":130.53,"envejecimiento_normalizado_2007_max":141.52,"envejecimiento_normalizado_2007_min":-81.13,"envejecimiento_normalizado_2007_avg":130.41,"envejecimiento_normalizado_2008_max":144.4,"envejecimiento_normalizado_2008_min":-79.58,"envejecimiento_normalizado_2008_avg":129.49,"envejecimiento_normalizado_2009_max":145.29,"envejecimiento_normalizado_2009_min":-78.61,"envejecimiento_normalizado_2009_avg":128.61,"envejecimiento_normalizado_2010_max":145.46,"envejecimiento_normalizado_2010_min":-79.6,"envejecimiento_normalizado_2010_avg":128.49,"envejecimiento_normalizado_2011_max":146.29,"envejecimiento_normalizado_2011_min":-80.47,"envejecimiento_normalizado_2011_avg":128.79,"pib_normalizado_1999_max":51.95,"pib_normalizado_1999_min":-33.01,"pib_normalizado_1999_avg":13.49,"pib_normalizado_2000_max":47.65,"pib_normalizado_2000_min":-32.1,"pib_normalizado_2000_avg":14.47,"pib_normalizado_2001_max":47.87,"pib_normalizado_2001_min":-31.74,"pib_normalizado_2001_avg":15.37,"pib_normalizado_2002_max":49.23,"pib_normalizado_2002_min":-31.41,"pib_normalizado_2002_avg":16.26,"pib_normalizado_2003_max":47.46,"pib_normalizado_2003_min":-29.86,"pib_normalizado_2003_avg":17.2,"pib_normalizado_2004_max":47.94,"pib_normalizado_2004_min":-30.72,"pib_normalizado_2004_avg":18.28,"pib_normalizado_2005_max":49.85,"pib_normalizado_2005_min":-31.74,"pib_normalizado_2005_avg":19.33,"pib_normalizado_2006_max":53.61,"pib_normalizado_2006_min":-32.1,"pib_normalizado_2006_avg":20.66,"pib_normalizado_2007_max":54.43,"pib_normalizado_2007_min":-31.52,"pib_normalizado_2007_avg":21.91,"pib_normalizado_2008_max":57.51,"pib_normalizado_2008_min":-31.54,"pib_normalizado_2008_avg":22.19,"inmigracion_normalizado_1999_max":811.71,"inmigracion_normalizado_1999_min":-96.4,"inmigracion_normalizado_1999_avg":24212.63,"inmigracion_normalizado_2000_max":819.98,"inmigracion_normalizado_2000_min":-95.66,"inmigracion_normalizado_2000_avg":28316.48,"inmigracion_normalizado_2001_max":969.15,"inmigracion_normalizado_2001_min":-94.77,"inmigracion_normalizado_2001_avg":37870.58,"inmigracion_normalizado_2002_max":999.15,"inmigracion_normalizado_2002_min":-94.16,"inmigracion_normalizado_2002_avg":49885.58,"inmigracion_normalizado_2003_max":1000.34,"inmigracion_normalizado_2003_min":-94.58,"inmigracion_normalizado_2003_avg":63508.46,"inmigracion_normalizado_2004_max":996.81,"inmigracion_normalizado_2004_min":-94.37,"inmigracion_normalizado_2004_avg":71034.73,"inmigracion_normalizado_2005_max":957.75,"inmigracion_normalizado_2005_min":-94.35,"inmigracion_normalizado_2005_avg":84451.62,"inmigracion_normalizado_2006_max":891.78,"inmigracion_normalizado_2006_min":-94.23,"inmigracion_normalizado_2006_avg":93031.19,"inmigracion_normalizado_2007_max":892.99,"inmigracion_normalizado_2007_min":-93.94,"inmigracion_normalizado_2007_avg":100961.4,"inmigracion_normalizado_2008_max":896.56,"inmigracion_normalizado_2008_min":-93.89,"inmigracion_normalizado_2008_avg":116240.92,"inmigracion_normalizado_2009_max":893.22,"inmigracion_normalizado_2009_min":-93.89,"inmigracion_normalizado_2009_avg":124351.5,"inmigracion_normalizado_2010_max":898.4,"inmigracion_normalizado_2010_min":-93.53,"inmigracion_normalizado_2010_avg":127003.48,"saldo_vegetativo_normalizado_1975_max":8.15,"saldo_vegetativo_normalizado_1975_min":-9.58,"saldo_vegetativo_normalizado_1975_avg":7.98,"saldo_vegetativo_normalizado_1976_max":7.11,"saldo_vegetativo_normalizado_1976_min":-9.63,"saldo_vegetativo_normalizado_1976_avg":8.31,"saldo_vegetativo_normalizado_1977_max":7.36,"saldo_vegetativo_normalizado_1977_min":-8.94,"saldo_vegetativo_normalizado_1977_avg":7.8,"saldo_vegetativo_normalizado_1978_max":6.96,"saldo_vegetativo_normalizado_1978_min":-8.45,"saldo_vegetativo_normalizado_1978_avg":7.42,"saldo_vegetativo_normalizado_1979_max":6.69,"saldo_vegetativo_normalizado_1979_min":-7.63,"saldo_vegetativo_normalizado_1979_avg":6.87,"saldo_vegetativo_normalizado_1980_max":6.16,"saldo_vegetativo_normalizado_1980_min":-7.81,"saldo_vegetativo_normalizado_1980_avg":6.41,"saldo_vegetativo_normalizado_1981_max":6.16,"saldo_vegetativo_normalizado_1981_min":-7.64,"saldo_vegetativo_normalizado_1981_avg":5.49,"saldo_vegetativo_normalizado_1982_max":5.48,"saldo_vegetativo_normalizado_1982_min":-8.16,"saldo_vegetativo_normalizado_1982_avg":5.32,"saldo_vegetativo_normalizado_1983_max":5.81,"saldo_vegetativo_normalizado_1983_min":-7.53,"saldo_vegetativo_normalizado_1983_avg":4.22,"saldo_vegetativo_normalizado_1984_max":5.02,"saldo_vegetativo_normalizado_1984_min":-7.14,"saldo_vegetativo_normalizado_1984_avg":3.86,"saldo_vegetativo_normalizado_1985_max":6.42,"saldo_vegetativo_normalizado_1985_min":-7.78,"saldo_vegetativo_normalizado_1985_avg":3.06,"saldo_vegetativo_normalizado_1986_max":6.82,"saldo_vegetativo_normalizado_1986_min":-7.63,"saldo_vegetativo_normalizado_1986_avg":2.75,"saldo_vegetativo_normalizado_1987_max":6.83,"saldo_vegetativo_normalizado_1987_min":-7.29,"saldo_vegetativo_normalizado_1987_avg":2.57,"saldo_vegetativo_normalizado_1988_max":7.53,"saldo_vegetativo_normalizado_1988_min":-7.83,"saldo_vegetativo_normalizado_1988_avg":2.13,"saldo_vegetativo_normalizado_1989_max":7.57,"saldo_vegetativo_normalizado_1989_min":-8.17,"saldo_vegetativo_normalizado_1989_avg":1.69,"saldo_vegetativo_normalizado_1990_max":8.45,"saldo_vegetativo_normalizado_1990_min":-8.78,"saldo_vegetativo_normalizado_1990_avg":1.28,"saldo_vegetativo_normalizado_1991_max":9.2,"saldo_vegetativo_normalizado_1991_min":-8.38,"saldo_vegetativo_normalizado_1991_avg":0.92,"saldo_vegetativo_normalizado_1992_max":11.95,"saldo_vegetativo_normalizado_1992_min":-8.29,"saldo_vegetativo_normalizado_1992_avg":1.11,"saldo_vegetativo_normalizado_1993_max":11.15,"saldo_vegetativo_normalizado_1993_min":-7.21,"saldo_vegetativo_normalizado_1993_avg":0.6,"saldo_vegetativo_normalizado_1994_max":9.03,"saldo_vegetativo_normalizado_1994_min":-7.71,"saldo_vegetativo_normalizado_1994_avg":0.16,"saldo_vegetativo_normalizado_1995_max":9.84,"saldo_vegetativo_normalizado_1995_min":-8.71,"saldo_vegetativo_normalizado_1995_avg":-0.18,"saldo_vegetativo_normalizado_1996_max":9.33,"saldo_vegetativo_normalizado_1996_min":-8.97,"saldo_vegetativo_normalizado_1996_avg":-0.47,"saldo_vegetativo_normalizado_1997_max":9.03,"saldo_vegetativo_normalizado_1997_min":-8.77,"saldo_vegetativo_normalizado_1997_avg":-0.3,"saldo_vegetativo_normalizado_1998_max":9.03,"saldo_vegetativo_normalizado_1998_min":-8.34,"saldo_vegetativo_normalizado_1998_avg":-0.78,"saldo_vegetativo_normalizado_1999_max":9.26,"saldo_vegetativo_normalizado_1999_min":-9.33,"saldo_vegetativo_normalizado_1999_avg":-0.77,"saldo_vegetativo_normalizado_2000_max":9.42,"saldo_vegetativo_normalizado_2000_min":-9.12,"saldo_vegetativo_normalizado_2000_avg":-0.16,"saldo_vegetativo_normalizado_2001_max":10.07,"saldo_vegetativo_normalizado_2001_min":-9.5,"saldo_vegetativo_normalizado_2001_avg":-0.04,"saldo_vegetativo_normalizado_2002_max":8.09,"saldo_vegetativo_normalizado_2002_min":-9.39,"saldo_vegetativo_normalizado_2002_avg":-0.16,"saldo_vegetativo_normalizado_2003_max":8.67,"saldo_vegetativo_normalizado_2003_min":-9.63,"saldo_vegetativo_normalizado_2003_avg":-0.03,"saldo_vegetativo_normalizado_2004_max":6.58,"saldo_vegetativo_normalizado_2004_min":-9.31,"saldo_vegetativo_normalizado_2004_avg":0.42,"saldo_vegetativo_normalizado_2005_max":7.7,"saldo_vegetativo_normalizado_2005_min":-9.59,"saldo_vegetativo_normalizado_2005_avg":0.28,"saldo_vegetativo_normalizado_2006_max":7.88,"saldo_vegetativo_normalizado_2006_min":-10.21,"saldo_vegetativo_normalizado_2006_avg":1.0,"saldo_vegetativo_normalizado_2007_max":8.27,"saldo_vegetativo_normalizado_2007_min":-9.82,"saldo_vegetativo_normalizado_2007_avg":0.8,"saldo_vegetativo_normalizado_2008_max":8.96,"saldo_vegetativo_normalizado_2008_min":-10.3,"saldo_vegetativo_normalizado_2008_avg":1.41,"saldo_vegetativo_normalizado_2009_max":10.42,"saldo_vegetativo_normalizado_2009_min":-9.85,"saldo_vegetativo_normalizado_2009_avg":0.98,"matriculaciones_normalizado_1997_max":169683.89,"matriculaciones_normalizado_1997_min":-27736.38,"matriculaciones_normalizado_1997_avg":21789.65,"matriculaciones_normalizado_1998_max":203555.33,"matriculaciones_normalizado_1998_min":-33216.38,"matriculaciones_normalizado_1998_avg":25752.35,"matriculaciones_normalizado_1999_max":238924.44,"matriculaciones_normalizado_1999_min":-38459.13,"matriculaciones_normalizado_1999_avg":30215.4,"matriculaciones_normalizado_2000_max":249832.11,"matriculaciones_normalizado_2000_min":-37450.29,"matriculaciones_normalizado_2000_avg":29600.67,"matriculaciones_normalizado_2001_max":285441.89,"matriculaciones_normalizado_2001_min":-38493.75,"matriculaciones_normalizado_2001_avg":30058.56,"matriculaciones_normalizado_2002_max":276075.89,"matriculaciones_normalizado_2002_min":-36747.91,"matriculaciones_normalizado_2002_avg":28304.65,"matriculaciones_normalizado_2003_max":277684.56,"matriculaciones_normalizado_2003_min":-37711.8,"matriculaciones_normalizado_2003_avg":30192.75,"matriculaciones_normalizado_2004_max":320934.56,"matriculaciones_normalizado_2004_min":-42444.64,"matriculaciones_normalizado_2004_avg":34172.94,"matriculaciones_normalizado_2005_max":335144.67,"matriculaciones_normalizado_2005_min":-44918.32,"matriculaciones_normalizado_2005_avg":36483.29,"matriculaciones_normalizado_2006_max":338633.78,"matriculaciones_normalizado_2006_min":-45287.36,"matriculaciones_normalizado_2006_avg":37222.02,"matriculaciones_normalizado_2007_max":340185.44,"matriculaciones_normalizado_2007_min":-44921.73,"matriculaciones_normalizado_2007_avg":36912.29,"matriculaciones_normalizado_2008_max":279494.89,"matriculaciones_normalizado_2008_min":-35496.18,"matriculaciones_normalizado_2008_avg":27061.73,"matriculaciones_normalizado_2009_max":201716.22,"matriculaciones_normalizado_2009_min":-26251.8,"matriculaciones_normalizado_2009_avg":21367.02,"edad_media_normalizado_2000_max":5.2,"edad_media_normalizado_2000_min":-6.41,"edad_media_normalizado_2000_avg":39.78,"edad_media_normalizado_2001_max":5.22,"edad_media_normalizado_2001_min":-7.02,"edad_media_normalizado_2001_avg":40.07,"edad_media_normalizado_2002_max":5.61,"edad_media_normalizado_2002_min":-7.14,"edad_media_normalizado_2002_avg":40.52,"edad_media_normalizado_2003_max":5.78,"edad_media_normalizado_2003_min":-6.98,"edad_media_normalizado_2003_avg":40.62,"edad_media_normalizado_2004_max":5.92,"edad_media_normalizado_2004_min":-6.9,"edad_media_normalizado_2004_avg":40.76,"edad_media_normalizado_2005_max":6.1,"edad_media_normalizado_2005_min":-6.78,"edad_media_normalizado_2005_avg":40.86,"edad_media_normalizado_2006_max":6.21,"edad_media_normalizado_2006_min":-6.71,"edad_media_normalizado_2006_avg":40.99,"edad_media_normalizado_2007_max":6.33,"edad_media_normalizado_2007_min":-6.87,"edad_media_normalizado_2007_avg":41.1,"edad_media_normalizado_2008_max":6.49,"edad_media_normalizado_2008_min":-6.78,"edad_media_normalizado_2008_avg":41.13,"edad_media_normalizado_2009_max":6.49,"edad_media_normalizado_2009_min":-6.85,"edad_media_normalizado_2009_avg":41.25,"edad_media_normalizado_2010_max":7.73,"edad_media_normalizado_2010_min":-5.75,"edad_media_normalizado_2010_avg":41.43},'municipios':{"inmigracion_normalizado_1999_max":53804.21,"inmigracion_normalizado_1999_min":-99.32,"inmigracion_normalizado_1999_avg":91.5,"inmigracion_normalizado_2000_max":58778.12,"inmigracion_normalizado_2000_min":-99.41,"inmigracion_normalizado_2000_avg":113.72,"inmigracion_normalizado_2001_max":81369.18,"inmigracion_normalizado_2001_min":-99.58,"inmigracion_normalizado_2001_avg":168.87,"inmigracion_normalizado_2002_max":112241.47,"inmigracion_normalizado_2002_min":-100.0,"inmigracion_normalizado_2002_avg":243.73,"inmigracion_normalizado_2003_max":103191.54,"inmigracion_normalizado_2003_min":-100.0,"inmigracion_normalizado_2003_avg":407.14,"inmigracion_normalizado_2004_max":100077.97,"inmigracion_normalizado_2004_min":-100.0,"inmigracion_normalizado_2004_avg":455.39,"inmigracion_normalizado_2005_max":94489.9,"inmigracion_normalizado_2005_min":-100.0,"inmigracion_normalizado_2005_avg":541.32,"inmigracion_normalizado_2006_max":85556.04,"inmigracion_normalizado_2006_min":-100.0,"inmigracion_normalizado_2006_avg":596.32,"inmigracion_normalizado_2007_max":85077.2,"inmigracion_normalizado_2007_min":-100.0,"inmigracion_normalizado_2007_avg":647.14,"inmigracion_normalizado_2008_max":85210.14,"inmigracion_normalizado_2008_min":-100.0,"inmigracion_normalizado_2008_avg":745.08,"inmigracion_normalizado_2009_max":84927.94,"inmigracion_normalizado_2009_min":-100.0,"inmigracion_normalizado_2009_avg":797.1,"inmigracion_normalizado_2010_max":84931.01,"inmigracion_normalizado_2010_min":-100.0,"inmigracion_normalizado_2010_avg":814.1,"edad_media_normalizado_2000_max":33.78,"edad_media_normalizado_2000_min":-16.88,"edad_media_normalizado_2000_avg":45.45,"edad_media_normalizado_2001_max":26.9,"edad_media_normalizado_2001_min":-17.0,"edad_media_normalizado_2001_avg":46.26,"edad_media_normalizado_2002_max":28.89,"edad_media_normalizado_2002_min":-17.56,"edad_media_normalizado_2002_avg":46.49,"edad_media_normalizado_2003_max":25.72,"edad_media_normalizado_2003_min":-17.64,"edad_media_normalizado_2003_avg":46.79,"edad_media_normalizado_2004_max":25.93,"edad_media_normalizado_2004_min":-19.38,"edad_media_normalizado_2004_avg":46.94,"edad_media_normalizado_2005_max":27.8,"edad_media_normalizado_2005_min":-17.83,"edad_media_normalizado_2005_avg":47.06,"edad_media_normalizado_2006_max":24.27,"edad_media_normalizado_2006_min":-17.61,"edad_media_normalizado_2006_avg":47.3,"edad_media_normalizado_2007_max":24.27,"edad_media_normalizado_2007_min":-17.61,"edad_media_normalizado_2007_avg":47.3,"edad_media_normalizado_2008_max":24.25,"edad_media_normalizado_2008_min":-17.25,"edad_media_normalizado_2008_avg":47.34,"edad_media_normalizado_2009_max":24.52,"edad_media_normalizado_2009_min":-16.94,"edad_media_normalizado_2009_avg":47.49,"edad_media_normalizado_2010_max":55.63,"edad_media_normalizado_2010_min":-35.8,"edad_media_normalizado_2010_avg":47.63},"autonomias":{"edad_media_normalizado_2000_max":3.66,"edad_media_normalizado_2000_min":-5.38,"edad_media_normalizado_2000_avg":39.24,"edad_media_normalizado_2001_max":3.79,"edad_media_normalizado_2001_min":-5.27,"edad_media_normalizado_2001_avg":39.51,"edad_media_normalizado_2002_max":4.06,"edad_media_normalizado_2002_min":-5.24,"edad_media_normalizado_2002_avg":39.91,"edad_media_normalizado_2003_max":4.22,"edad_media_normalizado_2003_min":-5.1,"edad_media_normalizado_2003_avg":40.01,"edad_media_normalizado_2004_max":4.36,"edad_media_normalizado_2004_min":-5.05,"edad_media_normalizado_2004_avg":40.15,"edad_media_normalizado_2005_max":4.45,"edad_media_normalizado_2005_min":-5.04,"edad_media_normalizado_2005_avg":40.26,"edad_media_normalizado_2006_max":4.54,"edad_media_normalizado_2006_min":-5.08,"edad_media_normalizado_2006_avg":40.41,"edad_media_normalizado_2007_max":4.66,"edad_media_normalizado_2007_min":-5.12,"edad_media_normalizado_2007_avg":40.53,"edad_media_normalizado_2008_max":4.76,"edad_media_normalizado_2008_min":-5.06,"edad_media_normalizado_2008_avg":40.58,"edad_media_normalizado_2009_max":4.75,"edad_media_normalizado_2009_min":-5.06,"edad_media_normalizado_2009_avg":40.69,"edad_media_normalizado_2010_max":5.13,"edad_media_normalizado_2010_min":-4.89,"edad_media_normalizado_2010_avg":40.88,"detenidos_normalizado_1993_max":397.4,"detenidos_normalizado_1993_min":-85.79,"detenidos_normalizado_1993_avg":6.19,"detenidos_normalizado_1994_max":443.92,"detenidos_normalizado_1994_min":-88.23,"detenidos_normalizado_1994_avg":6.29,"detenidos_normalizado_1995_max":464.39,"detenidos_normalizado_1995_min":-95.18,"detenidos_normalizado_1995_avg":6.43,"detenidos_normalizado_1996_max":439.49,"detenidos_normalizado_1996_min":-97.87,"detenidos_normalizado_1996_avg":6.58,"detenidos_normalizado_1997_max":443.15,"detenidos_normalizado_1997_min":-97.52,"detenidos_normalizado_1997_avg":6.46,"detenidos_normalizado_1998_max":407.61,"detenidos_normalizado_1998_min":-98.05,"detenidos_normalizado_1998_avg":6.14,"detenidos_normalizado_1999_max":416.77,"detenidos_normalizado_1999_min":-61.13,"detenidos_normalizado_1999_avg":6.69,"detenidos_normalizado_2000_max":399.58,"detenidos_normalizado_2000_min":-61.06,"detenidos_normalizado_2000_avg":6.73,"detenidos_normalizado_2001_max":370.04,"detenidos_normalizado_2001_min":-57.86,"detenidos_normalizado_2001_avg":6.79,"detenidos_normalizado_2002_max":371.04,"detenidos_normalizado_2002_min":-57.99,"detenidos_normalizado_2002_avg":6.95,"detenidos_normalizado_2003_max":326.21,"detenidos_normalizado_2003_min":-54.95,"detenidos_normalizado_2003_avg":6.11,"detenidos_normalizado_2004_max":284.06,"detenidos_normalizado_2004_min":-54.24,"detenidos_normalizado_2004_avg":6.67,"detenidos_normalizado_2005_max":278.72,"detenidos_normalizado_2005_min":-56.25,"detenidos_normalizado_2005_avg":6.88,"detenidos_normalizado_2006_max":261.85,"detenidos_normalizado_2006_min":-66.18,"detenidos_normalizado_2006_avg":6.92,"detenidos_normalizado_2007_max":255.33,"detenidos_normalizado_2007_min":-55.86,"detenidos_normalizado_2007_avg":7.45,"detenidos_normalizado_2008_max":265.46,"detenidos_normalizado_2008_min":-49.21,"detenidos_normalizado_2008_avg":8.6,"detenidos_normalizado_2009_max":258.27,"detenidos_normalizado_2009_min":-51.12,"detenidos_normalizado_2009_avg":8.78,"envejecimiento_normalizado_1991_max":32.18,"envejecimiento_normalizado_1991_min":-32.76,"envejecimiento_normalizado_1991_avg":69.85,"envejecimiento_normalizado_1992_max":34.0,"envejecimiento_normalizado_1992_min":-35.28,"envejecimiento_normalizado_1992_avg":73.97,"envejecimiento_normalizado_1993_max":35.67,"envejecimiento_normalizado_1993_min":-38.14,"envejecimiento_normalizado_1993_avg":78.4,"envejecimiento_normalizado_1994_max":37.51,"envejecimiento_normalizado_1994_min":-41.25,"envejecimiento_normalizado_1994_avg":83.22,"envejecimiento_normalizado_1995_max":41.99,"envejecimiento_normalizado_1995_min":-44.64,"envejecimiento_normalizado_1995_avg":88.31,"envejecimiento_normalizado_1996_max":47.23,"envejecimiento_normalizado_1996_min":-48.27,"envejecimiento_normalizado_1996_avg":93.6,"envejecimiento_normalizado_1997_max":52.67,"envejecimiento_normalizado_1997_min":-51.59,"envejecimiento_normalizado_1997_avg":98.84,"envejecimiento_normalizado_1998_max":58.51,"envejecimiento_normalizado_1998_min":-55.02,"envejecimiento_normalizado_1998_avg":103.88,"envejecimiento_normalizado_1999_max":64.48,"envejecimiento_normalizado_1999_min":-58.22,"envejecimiento_normalizado_1999_avg":108.64,"envejecimiento_normalizado_2000_max":70.33,"envejecimiento_normalizado_2000_min":-61.0,"envejecimiento_normalizado_2000_avg":112.82,"envejecimiento_normalizado_2001_max":75.65,"envejecimiento_normalizado_2001_min":-63.13,"envejecimiento_normalizado_2001_avg":116.04,"envejecimiento_normalizado_2002_max":80.6,"envejecimiento_normalizado_2002_min":-64.68,"envejecimiento_normalizado_2002_avg":118.29,"envejecimiento_normalizado_2003_max":83.81,"envejecimiento_normalizado_2003_min":-63.05,"envejecimiento_normalizado_2003_avg":118.81,"envejecimiento_normalizado_2004_max":85.28,"envejecimiento_normalizado_2004_min":-61.72,"envejecimiento_normalizado_2004_avg":118.97,"envejecimiento_normalizado_2005_max":85.96,"envejecimiento_normalizado_2005_min":-60.29,"envejecimiento_normalizado_2005_avg":119.02,"envejecimiento_normalizado_2006_max":85.93,"envejecimiento_normalizado_2006_min":-58.46,"envejecimiento_normalizado_2006_avg":118.73,"envejecimiento_normalizado_2007_max":85.43,"envejecimiento_normalizado_2007_min":-56.62,"envejecimiento_normalizado_2007_avg":118.44,"envejecimiento_normalizado_2008_max":84.25,"envejecimiento_normalizado_2008_min":-54.58,"envejecimiento_normalizado_2008_avg":117.56,"envejecimiento_normalizado_2009_max":83.34,"envejecimiento_normalizado_2009_min":-53.58,"envejecimiento_normalizado_2009_avg":116.85,"envejecimiento_normalizado_2010_max":82.07,"envejecimiento_normalizado_2010_min":-54.07,"envejecimiento_normalizado_2010_avg":116.66,"envejecimiento_normalizado_2011_max":80.8,"envejecimiento_normalizado_2011_min":-54.84,"envejecimiento_normalizado_2011_avg":116.94,"inmigracion_normalizado_1999_max":233.13,"inmigracion_normalizado_1999_min":-92.76,"inmigracion_normalizado_1999_avg":69494.5,"inmigracion_normalizado_2000_max":236.15,"inmigracion_normalizado_2000_min":-92.82,"inmigracion_normalizado_2000_avg":81172.17,"inmigracion_normalizado_2001_max":290.65,"inmigracion_normalizado_2001_min":-94.33,"inmigracion_normalizado_2001_avg":108684.78,"inmigracion_normalizado_2002_max":301.61,"inmigracion_normalizado_2002_min":-95.52,"inmigracion_normalizado_2002_avg":143395.39,"inmigracion_normalizado_2003_max":302.05,"inmigracion_normalizado_2003_min":-96.5,"inmigracion_normalizado_2003_avg":182753.11,"inmigracion_normalizado_2004_max":300.76,"inmigracion_normalizado_2004_min":-96.96,"inmigracion_normalizado_2004_avg":204516.0,"inmigracion_normalizado_2005_max":286.48,"inmigracion_normalizado_2005_min":-97.32,"inmigracion_normalizado_2005_avg":243394.44,"inmigracion_normalizado_2006_max":292.22,"inmigracion_normalizado_2006_min":-97.42,"inmigracion_normalizado_2006_avg":268118.0,"inmigracion_normalizado_2007_max":285.79,"inmigracion_normalizado_2007_min":-97.57,"inmigracion_normalizado_2007_avg":290944.67,"inmigracion_normalizado_2008_max":278.66,"inmigracion_normalizado_2008_min":-97.77,"inmigracion_normalizado_2008_avg":335010.72,"inmigracion_normalizado_2009_max":281.36,"inmigracion_normalizado_2009_min":-97.77,"inmigracion_normalizado_2009_avg":358375.11,"inmigracion_normalizado_2010_max":278.11,"inmigracion_normalizado_2010_min":-97.64,"inmigracion_normalizado_2010_avg":365963.0,"jovenes_parados_normalizado_1991_max":0.82,"jovenes_parados_normalizado_1991_min":-0.53,"jovenes_parados_normalizado_1991_avg":11.8,"jovenes_parados_normalizado_1992_max":0.7,"jovenes_parados_normalizado_1992_min":-0.68,"jovenes_parados_normalizado_1992_avg":11.78,"jovenes_parados_normalizado_1993_max":0.59,"jovenes_parados_normalizado_1993_min":-0.45,"jovenes_parados_normalizado_1993_avg":15.41,"jovenes_parados_normalizado_1994_max":0.49,"jovenes_parados_normalizado_1994_min":-0.41,"jovenes_parados_normalizado_1994_avg":18.16,"jovenes_parados_normalizado_1995_max":0.58,"jovenes_parados_normalizado_1995_min":-0.54,"jovenes_parados_normalizado_1995_avg":16.82,"jovenes_parados_normalizado_1996_max":0.58,"jovenes_parados_normalizado_1996_min":-0.62,"jovenes_parados_normalizado_1996_avg":15.71,"jovenes_parados_normalizado_1997_max":0.79,"jovenes_parados_normalizado_1997_min":-0.61,"jovenes_parados_normalizado_1997_avg":14.25,"jovenes_parados_normalizado_1998_max":0.92,"jovenes_parados_normalizado_1998_min":-0.62,"jovenes_parados_normalizado_1998_avg":12.08,"jovenes_parados_normalizado_1999_max":1.2,"jovenes_parados_normalizado_1999_min":-0.68,"jovenes_parados_normalizado_1999_avg":9.44,"jovenes_parados_normalizado_2000_max":1.34,"jovenes_parados_normalizado_2000_min":-0.73,"jovenes_parados_normalizado_2000_avg":7.49,"jovenes_parados_normalizado_2001_max":1.3,"jovenes_parados_normalizado_2001_min":-0.68,"jovenes_parados_normalizado_2001_avg":4.53,"jovenes_parados_normalizado_2002_max":0.89,"jovenes_parados_normalizado_2002_min":-0.75,"jovenes_parados_normalizado_2002_avg":4.88,"jovenes_parados_normalizado_2003_max":0.94,"jovenes_parados_normalizado_2003_min":-0.62,"jovenes_parados_normalizado_2003_avg":4.75,"jovenes_parados_normalizado_2004_max":0.98,"jovenes_parados_normalizado_2004_min":-0.64,"jovenes_parados_normalizado_2004_avg":4.2,"jovenes_parados_normalizado_2005_max":1.02,"jovenes_parados_normalizado_2005_min":-0.57,"jovenes_parados_normalizado_2005_avg":2.86,"jovenes_parados_normalizado_2006_max":1.22,"jovenes_parados_normalizado_2006_min":-0.72,"jovenes_parados_normalizado_2006_avg":2.27,"jovenes_parados_normalizado_2007_max":1.55,"jovenes_parados_normalizado_2007_min":-0.72,"jovenes_parados_normalizado_2007_avg":1.83,"jovenes_parados_normalizado_2008_max":1.4,"jovenes_parados_normalizado_2008_min":-0.61,"jovenes_parados_normalizado_2008_avg":2.32,"jovenes_parados_normalizado_2009_max":0.78,"jovenes_parados_normalizado_2009_min":-0.53,"jovenes_parados_normalizado_2009_avg":5.68,"saldo_vegetativo_normalizado_1975_max":6.49,"saldo_vegetativo_normalizado_1975_min":-4.19,"saldo_vegetativo_normalizado_1975_avg":9.58,"saldo_vegetativo_normalizado_1976_max":5.56,"saldo_vegetativo_normalizado_1976_min":-4.22,"saldo_vegetativo_normalizado_1976_avg":9.79,"saldo_vegetativo_normalizado_1977_max":5.12,"saldo_vegetativo_normalizado_1977_min":-3.99,"saldo_vegetativo_normalizado_1977_avg":9.04,"saldo_vegetativo_normalizado_1978_max":4.69,"saldo_vegetativo_normalizado_1978_min":-3.44,"saldo_vegetativo_normalizado_1978_avg":8.52,"saldo_vegetativo_normalizado_1979_max":5.01,"saldo_vegetativo_normalizado_1979_min":-3.28,"saldo_vegetativo_normalizado_1979_avg":7.74,"saldo_vegetativo_normalizado_1980_max":4.94,"saldo_vegetativo_normalizado_1980_min":-3.46,"saldo_vegetativo_normalizado_1980_avg":7.08,"saldo_vegetativo_normalizado_1981_max":4.85,"saldo_vegetativo_normalizado_1981_min":-3.19,"saldo_vegetativo_normalizado_1981_avg":6.12,"saldo_vegetativo_normalizado_1982_max":4.21,"saldo_vegetativo_normalizado_1982_min":-3.82,"saldo_vegetativo_normalizado_1982_avg":5.71,"saldo_vegetativo_normalizado_1983_max":4.74,"saldo_vegetativo_normalizado_1983_min":-3.67,"saldo_vegetativo_normalizado_1983_avg":4.59,"saldo_vegetativo_normalizado_1984_max":4.24,"saldo_vegetativo_normalizado_1984_min":-3.82,"saldo_vegetativo_normalizado_1984_avg":4.24,"saldo_vegetativo_normalizado_1985_max":5.49,"saldo_vegetativo_normalizado_1985_min":-4.11,"saldo_vegetativo_normalizado_1985_avg":3.45,"saldo_vegetativo_normalizado_1986_max":4.98,"saldo_vegetativo_normalizado_1986_min":-3.78,"saldo_vegetativo_normalizado_1986_avg":3.08,"saldo_vegetativo_normalizado_1987_max":6.13,"saldo_vegetativo_normalizado_1987_min":-4.46,"saldo_vegetativo_normalizado_1987_avg":2.91,"saldo_vegetativo_normalizado_1988_max":7.26,"saldo_vegetativo_normalizado_1988_min":-5.15,"saldo_vegetativo_normalizado_1988_avg":2.57,"saldo_vegetativo_normalizado_1989_max":5.96,"saldo_vegetativo_normalizado_1989_min":-5.24,"saldo_vegetativo_normalizado_1989_avg":2.03,"saldo_vegetativo_normalizado_1990_max":5.25,"saldo_vegetativo_normalizado_1990_min":-5.36,"saldo_vegetativo_normalizado_1990_avg":1.53,"saldo_vegetativo_normalizado_1991_max":6.49,"saldo_vegetativo_normalizado_1991_min":-5.3,"saldo_vegetativo_normalizado_1991_avg":1.32,"saldo_vegetativo_normalizado_1992_max":6.98,"saldo_vegetativo_normalizado_1992_min":-5.69,"saldo_vegetativo_normalizado_1992_avg":1.46,"saldo_vegetativo_normalizado_1993_max":8.17,"saldo_vegetativo_normalizado_1993_min":-5.93,"saldo_vegetativo_normalizado_1993_avg":0.96,"saldo_vegetativo_normalizado_1994_max":6.56,"saldo_vegetativo_normalizado_1994_min":-5.37,"saldo_vegetativo_normalizado_1994_avg":0.6,"saldo_vegetativo_normalizado_1995_max":7.81,"saldo_vegetativo_normalizado_1995_min":-5.84,"saldo_vegetativo_normalizado_1995_avg":0.29,"saldo_vegetativo_normalizado_1996_max":5.85,"saldo_vegetativo_normalizado_1996_min":-5.79,"saldo_vegetativo_normalizado_1996_avg":0.04,"saldo_vegetativo_normalizado_1997_max":6.77,"saldo_vegetativo_normalizado_1997_min":-5.7,"saldo_vegetativo_normalizado_1997_avg":0.29,"saldo_vegetativo_normalizado_1998_max":6.05,"saldo_vegetativo_normalizado_1998_min":-5.91,"saldo_vegetativo_normalizado_1998_avg":-0.12,"saldo_vegetativo_normalizado_1999_max":6.91,"saldo_vegetativo_normalizado_1999_min":-6.18,"saldo_vegetativo_normalizado_1999_avg":-0.06,"saldo_vegetativo_normalizado_2000_max":6.55,"saldo_vegetativo_normalizado_2000_min":-6.42,"saldo_vegetativo_normalizado_2000_avg":0.58,"saldo_vegetativo_normalizado_2001_max":5.97,"saldo_vegetativo_normalizado_2001_min":-6.14,"saldo_vegetativo_normalizado_2001_avg":0.82,"saldo_vegetativo_normalizado_2002_max":5.94,"saldo_vegetativo_normalizado_2002_min":-6.62,"saldo_vegetativo_normalizado_2002_avg":0.82,"saldo_vegetativo_normalizado_2003_max":5.89,"saldo_vegetativo_normalizado_2003_min":-6.71,"saldo_vegetativo_normalizado_2003_avg":0.92,"saldo_vegetativo_normalizado_2004_max":6.21,"saldo_vegetativo_normalizado_2004_min":-6.81,"saldo_vegetativo_normalizado_2004_avg":1.43,"saldo_vegetativo_normalizado_2005_max":6.28,"saldo_vegetativo_normalizado_2005_min":-6.6,"saldo_vegetativo_normalizado_2005_avg":1.27,"saldo_vegetativo_normalizado_2006_max":5.55,"saldo_vegetativo_normalizado_2006_min":-6.79,"saldo_vegetativo_normalizado_2006_avg":1.88,"saldo_vegetativo_normalizado_2007_max":6.15,"saldo_vegetativo_normalizado_2007_min":-6.76,"saldo_vegetativo_normalizado_2007_avg":1.76,"saldo_vegetativo_normalizado_2008_max":6.42,"saldo_vegetativo_normalizado_2008_min":-7.08,"saldo_vegetativo_normalizado_2008_avg":2.33,"saldo_vegetativo_normalizado_2009_max":5.9,"saldo_vegetativo_normalizado_2009_min":-6.7,"saldo_vegetativo_normalizado_2009_avg":1.84,"parados_larga_duracion_normalizado_1991_max":62.33,"parados_larga_duracion_normalizado_1991_min":-52.87,"parados_larga_duracion_normalizado_1991_avg":7.36,"parados_larga_duracion_normalizado_1992_max":67.06,"parados_larga_duracion_normalizado_1992_min":-59.4,"parados_larga_duracion_normalizado_1992_avg":7.74,"parados_larga_duracion_normalizado_1993_max":52.59,"parados_larga_duracion_normalizado_1993_min":-42.46,"parados_larga_duracion_normalizado_1993_avg":10.03,"parados_larga_duracion_normalizado_1994_max":45.29,"parados_larga_duracion_normalizado_1994_min":-42.87,"parados_larga_duracion_normalizado_1994_avg":11.82,"parados_larga_duracion_normalizado_1995_max":53.29,"parados_larga_duracion_normalizado_1995_min":-52.05,"parados_larga_duracion_normalizado_1995_avg":11.16,"parados_larga_duracion_normalizado_1996_max":54.67,"parados_larga_duracion_normalizado_1996_min":-54.2,"parados_larga_duracion_normalizado_1996_avg":10.42,"parados_larga_duracion_normalizado_1997_max":57.34,"parados_larga_duracion_normalizado_1997_min":-56.94,"parados_larga_duracion_normalizado_1997_avg":9.58,"parados_larga_duracion_normalizado_1998_max":63.33,"parados_larga_duracion_normalizado_1998_min":-53.06,"parados_larga_duracion_normalizado_1998_avg":8.39,"parados_larga_duracion_normalizado_1999_max":80.49,"parados_larga_duracion_normalizado_1999_min":-62.33,"parados_larga_duracion_normalizado_1999_avg":6.68,"parados_larga_duracion_normalizado_2000_max":81.58,"parados_larga_duracion_normalizado_2000_min":-69.6,"parados_larga_duracion_normalizado_2000_avg":5.47,"parados_larga_duracion_normalizado_2001_max":106.14,"parados_larga_duracion_normalizado_2001_min":-68.61,"parados_larga_duracion_normalizado_2001_avg":3.39,"parados_larga_duracion_normalizado_2002_max":88.54,"parados_larga_duracion_normalizado_2002_min":-66.58,"parados_larga_duracion_normalizado_2002_avg":3.58,"parados_larga_duracion_normalizado_2003_max":82.36,"parados_larga_duracion_normalizado_2003_min":-67.35,"parados_larga_duracion_normalizado_2003_avg":3.56,"parados_larga_duracion_normalizado_2004_max":72.36,"parados_larga_duracion_normalizado_2004_min":-63.8,"parados_larga_duracion_normalizado_2004_avg":3.31,"parados_larga_duracion_normalizado_2005_max":77.23,"parados_larga_duracion_normalizado_2005_min":-61.3,"parados_larga_duracion_normalizado_2005_avg":2.92,"parados_larga_duracion_normalizado_2006_max":76.38,"parados_larga_duracion_normalizado_2006_min":-66.79,"parados_larga_duracion_normalizado_2006_avg":2.4,"parados_larga_duracion_normalizado_2007_max":76.72,"parados_larga_duracion_normalizado_2007_min":-68.17,"parados_larga_duracion_normalizado_2007_avg":2.22,"parados_larga_duracion_normalizado_2008_max":70.29,"parados_larga_duracion_normalizado_2008_min":-60.19,"parados_larga_duracion_normalizado_2008_avg":2.55,"parados_larga_duracion_normalizado_2009_max":74.75,"parados_larga_duracion_normalizado_2009_min":-56.56,"parados_larga_duracion_normalizado_2009_avg":4.92,"matriculaciones_normalizado_1997_max":158712.17,"matriculaciones_normalizado_1997_min":-71297.83,"matriculaciones_normalizado_1997_avg":75931.83,"matriculaciones_normalizado_1998_max":193212.06,"matriculaciones_normalizado_1998_min":-84465.94,"matriculaciones_normalizado_1998_avg":89990.94,"matriculaciones_normalizado_1999_max":221959.44,"matriculaciones_normalizado_1999_min":-99152.56,"matriculaciones_normalizado_1999_avg":105252.56,"matriculaciones_normalizado_2000_max":210424.0,"matriculaciones_normalizado_2000_min":-97155.0,"matriculaciones_normalizado_2000_avg":102642.0,"matriculaciones_normalizado_2001_max":234934.89,"matriculaciones_normalizado_2001_min":-98451.11,"matriculaciones_normalizado_2001_avg":103597.11,"matriculaciones_normalizado_2002_max":229622.56,"matriculaciones_normalizado_2002_min":-92356.44,"matriculaciones_normalizado_2002_avg":97113.44,"matriculaciones_normalizado_2003_max":224838.22,"matriculaciones_normalizado_2003_min":-98981.78,"matriculaciones_normalizado_2003_avg":104209.78,"matriculaciones_normalizado_2004_max":262233.78,"matriculaciones_normalizado_2004_min":-111805.22,"matriculaciones_normalizado_2004_avg":117279.22,"matriculaciones_normalizado_2005_max":271218.78,"matriculaciones_normalizado_2005_min":-119645.22,"matriculaciones_normalizado_2005_avg":125365.22,"matriculaciones_normalizado_2006_max":273607.39,"matriculaciones_normalizado_2006_min":-121632.61,"matriculaciones_normalizado_2006_avg":127259.61,"matriculaciones_normalizado_2007_max":277029.89,"matriculaciones_normalizado_2007_min":-119582.11,"matriculaciones_normalizado_2007_avg":125540.11,"matriculaciones_normalizado_2008_max":236721.67,"matriculaciones_normalizado_2008_min":-86911.33,"matriculaciones_normalizado_2008_avg":91905.33,"matriculaciones_normalizado_2009_max":166925.33,"matriculaciones_normalizado_2009_min":-68697.67,"matriculaciones_normalizado_2009_avg":73026.67,"pib_normalizado_1999_max":39.06,"pib_normalizado_1999_min":-36.05,"pib_normalizado_1999_avg":14.17,"pib_normalizado_2000_max":40.29,"pib_normalizado_2000_min":-35.28,"pib_normalizado_2000_avg":15.23,"pib_normalizado_2001_max":39.41,"pib_normalizado_2001_min":-34.71,"pib_normalizado_2001_avg":16.11,"pib_normalizado_2002_max":38.42,"pib_normalizado_2002_min":-33.37,"pib_normalizado_2002_avg":16.91,"pib_normalizado_2003_max":36.07,"pib_normalizado_2003_min":-31.99,"pib_normalizado_2003_avg":17.8,"pib_normalizado_2004_max":35.83,"pib_normalizado_2004_min":-31.25,"pib_normalizado_2004_avg":18.87,"pib_normalizado_2005_max":34.46,"pib_normalizado_2005_min":-30.73,"pib_normalizado_2005_avg":20.03,"pib_normalizado_2006_max":35.89,"pib_normalizado_2006_min":-32.06,"pib_normalizado_2006_avg":21.39,"pib_normalizado_2007_max":35.25,"pib_normalizado_2007_min":-34.45,"pib_normalizado_2007_avg":22.67,"pib_normalizado_2008_max":36.92,"pib_normalizado_2008_min":-34.14,"pib_normalizado_2008_avg":23.0,"salario_medio_normalizado_1995_max":18.21,"salario_medio_normalizado_1995_min":-20.18,"salario_medio_normalizado_1995_avg":18915.11,"salario_medio_normalizado_1996_max":17.72,"salario_medio_normalizado_1996_min":-17.74,"salario_medio_normalizado_1996_avg":19592.44,"salario_medio_normalizado_1997_max":18.14,"salario_medio_normalizado_1997_min":-16.47,"salario_medio_normalizado_1997_avg":19949.78,"salario_medio_normalizado_1998_max":17.24,"salario_medio_normalizado_1998_min":-16.38,"salario_medio_normalizado_1998_avg":20303.5,"salario_medio_normalizado_1999_max":17.39,"salario_medio_normalizado_1999_min":-16.31,"salario_medio_normalizado_1999_avg":20707.17,"salario_medio_normalizado_2000_max":17.14,"salario_medio_normalizado_2000_min":-15.1,"salario_medio_normalizado_2000_avg":21239.28,"salario_medio_normalizado_2001_max":16.42,"salario_medio_normalizado_2001_min":-14.77,"salario_medio_normalizado_2001_avg":22039.67,"salario_medio_normalizado_2002_max":14.97,"salario_medio_normalizado_2002_min":-14.47,"salario_medio_normalizado_2002_avg":22841.72,"salario_medio_normalizado_2003_max":14.27,"salario_medio_normalizado_2003_min":-14.78,"salario_medio_normalizado_2003_avg":23548.67,"salario_medio_normalizado_2004_max":14.56,"salario_medio_normalizado_2004_min":-15.05,"salario_medio_normalizado_2004_avg":24179.78,"salario_medio_normalizado_2005_max":14.56,"salario_medio_normalizado_2005_min":-13.84,"salario_medio_normalizado_2005_avg":24860.67,"salario_medio_normalizado_2006_max":14.23,"salario_medio_normalizado_2006_min":-12.77,"salario_medio_normalizado_2006_avg":25725.78,"salario_medio_normalizado_2007_max":14.74,"salario_medio_normalizado_2007_min":-12.76,"salario_medio_normalizado_2007_avg":26912.33,"salario_medio_normalizado_2008_max":15.47,"salario_medio_normalizado_2008_min":-11.11,"salario_medio_normalizado_2008_avg":28595.5,"salario_medio_normalizado_2009_max":15.68,"salario_medio_normalizado_2009_min":-9.85,"salario_medio_normalizado_2009_avg":29729.89,"secundaria_acabada_normalizado_2004_max":29.91,"secundaria_acabada_normalizado_2004_min":-23.06,"secundaria_acabada_normalizado_2004_avg":41.38,"secundaria_acabada_normalizado_2005_max":25.15,"secundaria_acabada_normalizado_2005_min":-26.24,"secundaria_acabada_normalizado_2005_avg":43.46,"secundaria_acabada_normalizado_2006_max":25.44,"secundaria_acabada_normalizado_2006_min":-26.83,"secundaria_acabada_normalizado_2006_avg":45.01,"secundaria_acabada_normalizado_2007_max":26.86,"secundaria_acabada_normalizado_2007_min":-29.17,"secundaria_acabada_normalizado_2007_avg":48.26,"secundaria_acabada_normalizado_2008_max":29.66,"secundaria_acabada_normalizado_2008_min":-27.65,"secundaria_acabada_normalizado_2008_avg":49.03,"secundaria_acabada_normalizado_2009_max":28.7,"secundaria_acabada_normalizado_2009_min":-25.27,"secundaria_acabada_normalizado_2009_avg":51.07,"secundaria_acabada_normalizado_2010_max":28.7,"secundaria_acabada_normalizado_2010_min":-25.27,"secundaria_acabada_normalizado_2010_avg":51.07,"secundaria_acabada_normalizado_2011_max":26.5,"secundaria_acabada_normalizado_2011_min":-24.57,"secundaria_acabada_normalizado_2011_avg":51.94,"penetracion_internet_normalizado_2004_max":27.89,"penetracion_internet_normalizado_2004_min":-24.47,"penetracion_internet_normalizado_2004_avg":-0.0,"penetracion_internet_normalizado_2005_max":34.2,"penetracion_internet_normalizado_2005_min":-32.75,"penetracion_internet_normalizado_2005_avg":-0.0,"penetracion_internet_normalizado_2006_max":30.44,"penetracion_internet_normalizado_2006_min":-43.77,"penetracion_internet_normalizado_2006_avg":-0.0,"penetracion_internet_normalizado_2007_max":29.37,"penetracion_internet_normalizado_2007_min":-37.61,"penetracion_internet_normalizado_2007_avg":-0.0,"penetracion_internet_normalizado_2008_max":23.86,"penetracion_internet_normalizado_2008_min":-23.78,"penetracion_internet_normalizado_2008_avg":-0.0,"penetracion_internet_normalizado_2009_max":20.64,"penetracion_internet_normalizado_2009_min":-25.07,"penetracion_internet_normalizado_2009_avg":-0.0,"penetracion_internet_normalizado_2010_max":15.37,"penetracion_internet_normalizado_2010_min":-16.0,"penetracion_internet_normalizado_2010_avg":-0.0,"audiencia_diaria_tv_normalizado_1997_max":6.32,"audiencia_diaria_tv_normalizado_1997_min":-4.15,"audiencia_diaria_tv_normalizado_1997_avg":0.0,"audiencia_diaria_tv_normalizado_1998_max":4.25,"audiencia_diaria_tv_normalizado_1998_min":-4.06,"audiencia_diaria_tv_normalizado_1998_avg":0.0,"audiencia_diaria_tv_normalizado_1999_max":6.66,"audiencia_diaria_tv_normalizado_1999_min":-6.23,"audiencia_diaria_tv_normalizado_1999_avg":-0.0,"audiencia_diaria_tv_normalizado_2000_max":5.13,"audiencia_diaria_tv_normalizado_2000_min":-3.71,"audiencia_diaria_tv_normalizado_2000_avg":0.0,"audiencia_diaria_tv_normalizado_2001_max":5.01,"audiencia_diaria_tv_normalizado_2001_min":-5.65,"audiencia_diaria_tv_normalizado_2001_avg":0.0,"audiencia_diaria_tv_normalizado_2002_max":2.95,"audiencia_diaria_tv_normalizado_2002_min":-4.93,"audiencia_diaria_tv_normalizado_2002_avg":-0.0,"audiencia_diaria_tv_normalizado_2003_max":4.52,"audiencia_diaria_tv_normalizado_2003_min":-5.51,"audiencia_diaria_tv_normalizado_2003_avg":0.0,"audiencia_diaria_tv_normalizado_2004_max":4.52,"audiencia_diaria_tv_normalizado_2004_min":-4.17,"audiencia_diaria_tv_normalizado_2004_avg":0.0,"audiencia_diaria_tv_normalizado_2005_max":4.68,"audiencia_diaria_tv_normalizado_2005_min":-3.76,"audiencia_diaria_tv_normalizado_2005_avg":-0.0,"audiencia_diaria_tv_normalizado_2006_max":5.72,"audiencia_diaria_tv_normalizado_2006_min":-4.37,"audiencia_diaria_tv_normalizado_2006_avg":0.0,"audiencia_diaria_tv_normalizado_2007_max":6.47,"audiencia_diaria_tv_normalizado_2007_min":-4.86,"audiencia_diaria_tv_normalizado_2007_avg":0.0,"audiencia_diaria_tv_normalizado_2008_max":5.26,"audiencia_diaria_tv_normalizado_2008_min":-5.57,"audiencia_diaria_tv_normalizado_2008_avg":0.0,"audiencia_diaria_tv_normalizado_2009_max":3.42,"audiencia_diaria_tv_normalizado_2009_min":-4.31,"audiencia_diaria_tv_normalizado_2009_avg":0.0,"prensa_diaria_normalizado_2000_max":49.45,"prensa_diaria_normalizado_2000_min":-51.34,"prensa_diaria_normalizado_2000_avg":0.0,"prensa_diaria_normalizado_2001_max":45.71,"prensa_diaria_normalizado_2001_min":-50.41,"prensa_diaria_normalizado_2001_avg":3.48,"prensa_diaria_normalizado_2002_max":49.3,"prensa_diaria_normalizado_2002_min":-44.61,"prensa_diaria_normalizado_2002_avg":3.44,"prensa_diaria_normalizado_2003_max":42.08,"prensa_diaria_normalizado_2003_min":-46.87,"prensa_diaria_normalizado_2003_avg":3.61,"prensa_diaria_normalizado_2004_max":32.91,"prensa_diaria_normalizado_2004_min":-40.8,"prensa_diaria_normalizado_2004_avg":3.57,"prensa_diaria_normalizado_2005_max":38.66,"prensa_diaria_normalizado_2005_min":-38.35,"prensa_diaria_normalizado_2005_avg":3.44,"prensa_diaria_normalizado_2006_max":39.49,"prensa_diaria_normalizado_2006_min":-37.63,"prensa_diaria_normalizado_2006_avg":3.41,"prensa_diaria_normalizado_2007_max":37.62,"prensa_diaria_normalizado_2007_min":-36.43,"prensa_diaria_normalizado_2007_avg":3.52,"prensa_diaria_normalizado_2008_max":37.82,"prensa_diaria_normalizado_2008_min":-40.17,"prensa_diaria_normalizado_2008_avg":3.49,"prensa_diaria_normalizado_2009_max":34.77,"prensa_diaria_normalizado_2009_min":-36.58,"prensa_diaria_normalizado_2009_avg":3.49,"paro_epa_normalizado_2005_max":80.18,"paro_epa_normalizado_2005_min":-39.38,"paro_epa_normalizado_2005_avg":9.36,"paro_epa_normalizado_2006_max":96.6,"paro_epa_normalizado_2006_min":-38.56,"paro_epa_normalizado_2006_avg":8.71,"paro_epa_normalizado_2007_max":130.43,"paro_epa_normalizado_2007_min":-42.85,"paro_epa_normalizado_2007_avg":8.39,"paro_epa_normalizado_2008_max":75.48,"paro_epa_normalizado_2008_min":-40.77,"paro_epa_normalizado_2008_avg":10.92,"paro_epa_normalizado_2009_max":56.13,"paro_epa_normalizado_2009_min":-35.4,"paro_epa_normalizado_2009_avg":16.89,"paro_epa_normalizado_2010_max":52.99,"paro_epa_normalizado_2010_min":-43.84,"paro_epa_normalizado_2010_avg":18.88,"paro_epa_normalizado_2011_max":45.37,"paro_epa_normalizado_2011_min":-43.18,"paro_epa_normalizado_2011_avg":20.52}}

