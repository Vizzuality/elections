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
  'lineas adsl': 'penetracion_internet_normalizado',
  'matriculaciones': 'matriculaciones_normalizado',
  'detenidos': 'detenidos_normalizado',
  'jovenes parados': 'jovenes_parados_normalizado',
  'parados larga duracion': 'parados_larga_duracion_normalizado'
};



var custom_map_style = [{featureType:"administrative.country",elementType:"all",stylers:[{saturation:-100},{visibility:"off"}]},{featureType:"administrative.province",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"all",stylers:[{lightness:7},{saturation:-91}]},{featureType:"all",elementType:"all",stylers:[]}];

var tooltipInfo = {
  "Envejecimiento" : {
    content: "Desviación respecto a la media nacional del índice de envejecimiento.",
    right: "más envej.",
    left: "menos envejec.",
    legendTop: "Más % de mayores de 65 años",
    legendBottom:"Menos % de mayores de 65 años"
  },
  "Inmigración" : {
    content: "Desviación respecto a la media del número de inmigrantes por habitante en el país.",
    left: "menos inmigr.",
    right: "más inmigr.",
    legendTop: "Más % de inmigración",
    legendBottom:"Menos % de inmigración"
  },
  "Tasa de paro" : {
    content: "Desviación respecto a la media nacional de la tasa de paro EPA.",
    left: "menos parados",
    right: "más parados",
    legendTop: "Más % paro",
    legendBottom:"Menos % paro"
  },
  "PIB per cápita" : {
    content: "Desviación respecto a la media nacional del PIB por habitante.",
    left: "menos PIB",
    right: "más PIB",
    legendTop: "Más PIB per cápita",
    legendBottom:"Menos PIB per cápita"
  },
  "Matriculaciones" : {
    content: "Desviación respecto a la media nacional del número de vehículos matriculados.",
    left: "menos vehic.",
    right: "más vehic.",
    legendTop: "Más vehículos",
    legendBottom:"Menos vehículos"
  },
  "Jóvenes parados" : {
    content: "Desviación respecto la media nacional del porcentaje de jóvenes parados de larga duración.",
    left: "menos paro",
    right: "más paro",
    legendTop: "Más jóvenes parados",
    legendBottom:"Menos jóvenes parados"
  },
  "Parados larga duración" : {
    content: "Desviación respecto la media nacional del porcentaje de parados de larga duración.",
    left: "menos paro",
    right: "más paro",
    legendTop: "Más parados",
    legendBottom:"Menos parados"
  },
  "Edad media" : {
    content: "Desviación respecto la edad media nacional en años.",
    right: "más mayores",
    left: "más jóvenes",
    legendTop: "Más edad",
    legendBottom:"Menos edad"
  },
  "Saldo Vegetativo" : {
    content: "Desviación respecto a la media nacional del saldo vegetativo.",
    left: "crece poco",
    right: "crece mucho",
    legendTop: "Mayor crecimiento",
    legendBottom:"Menor crecimiento"
  },
  "Salario medio" : {
    content: "Desviación respecto a la media nacional del salario medio.",
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
    content: "Desviación respecto a la media nacional del consumo de tv.",
    left: "menos tv",
    right: "más tv",
    legendTop: "Más consumo tv",
    legendBottom:"Menos consumo tv"
  },
  "Acceso Internet" : {
    content: "Desviación respecto a la media nacional del porcentaje de personas con acceso a internet",
    left: "menor acceso",
    right: "mayor acceso",
    legendTop: "Más acceso a internet",
    legendBottom:"Menos acceso a internet"
  },
  "Consumo prensa" : {
    content: "Desviación respecto a la media nacional del consumo de prensa.",
    left: "menos prensa",
    right: "más prensa",
    legendTop: "Más consumo prensa",
    legendBottom:"Menos consumo prensa"
  },
  "Detenidos" : {
    content: "Desviación respecto a la media nacional de detenidos por cada mil habitantes.",
    left: "menos detenidos",
    right: "más detenidos",
    legendTop: "Más detenidos",
    legendBottom:"Menos detenidos"
  }
};

var textInfoWindow = {
  envejecimiento_normalizado : {
    before_negative: "Población con un ",
    after_negative: "% menos respecto a la media de <strong><%= media %></strong> personas mayores de 65 años por cada 100 menos de 16 en España.",
    before_positive: "Población con un ",
    after_positive: "% más respecto a la media de <strong><%= media %></strong> personas mayores de 65 años por cada 100 menos de 16 en España."
  },
  paro_epa_normalizado : {
    before_negative: "Tasa de paro EPA un ",
    after_negative: "% por debajo de la media nacional <strong>(<%= media %>%)</strong>.",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: "% por encima de la media nacional <strong>(<%= media %>%)</strong>."
  },
  paro_normalizado : {
    before_negative: "La tasa de paro se encuentra a un ",
    after_negative: "% por debajo de la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: "% por encima de la media nacional <strong>(<%= media %>)</strong>."
  },
  pib_normalizado : {
    before_negative: "El PIB per cápita un ",
    after_negative: "% más bajo que la media nacional <strong>(<%= media %>M)</strong>.",
    before_positive: "El PIB per cápita aquí es un ",
    after_positive: "% más alto que la media nacional <strong>(<%= media %>M)</strong>."
  },
  edad_media_normalizado : {
    before_negative: "Su población es ",
    after_negative: " años más jóven que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Su población es ",
    after_positive: " años más mayor que la media nacional <strong>(<%= media %>)</strong>."
  },
  inmigracion_normalizado : {
    before_negative: "Porcentaje de inmigración ",
    after_negative: "% por debajo de la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  saldo_vegetativo_normalizado : {
    before_negative: "El crecimiento natural de la población está un ",
    after_negative: "% por debajo de la media <strong>(<%= media %>%)</strong>.",
    before_positive: "El crecimiento de la población está un ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  salario_medio_normalizado : {
    before_negative: "Salario medio ",
    after_negative: "% por debajo de la media <strong>(<%= media %>)</strong>.",
    before_positive: "El salario medio aquí está un ",
    after_positive: "% por encima de la media <strong>(<%= media %>)</strong>."
  },
  secundaria_acabada_normalizado: {
    before_negative: "",
    after_negative: "% menos de habitantes que la media nacional <strong>(<%= media %>%)</strong>, tiene estudios secundarios.",
    before_positive: "",
    after_positive: "% más de habitantes que la media nacional <strong>(<%= media %>%)</strong>, tiene estudios secundarios."
  },
  penetracion_internet_normalizado: {
    before_negative: "Un ",
    after_negative: "% menos que la media <strong>(<%= media %>%)</strong>, tiene acceso a internet.",
    before_positive: "Un ",
    after_positive: "% más que la media <strong>(<%= media %>%)</strong>, tiene acceso a internet."
  },
  audiencia_diaria_tv_normalizado : {
    before_negative: "Consume un ",
    after_negative: "% menos de televisión que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Consume un ",
    after_positive: "  más de televisión que la media nacional <strong>(<%= media %>)</strong>."
  },
  prensa_diaria_normalizado : {
    before_negative: "Consume un ",
    after_negative: "% menos de radio que la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "El porcentaje de inmigración ",
    after_positive: "% más de radio que la media nacional <strong>(<%= media %>)</strong>."
  },
  matriculaciones_normalizado : {
    before_negative: "Hay un ",
    after_negative: "% menos de vehículos matriculados respecto a la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Hay un ",
    after_positive: "% mas de vehículos matriculados respecto a la media nacional <strong>(<%= media %>)</strong>."
  },
  detenidos_normalizado : {
    before_negative: "Hay un ",
    after_negative: "% menos de detenidos respecto a la media nacional <strong>(<%= media %>)</strong>.",
    before_positive: "Hay un ",
    after_positive: "% mas de detenidos respecto a la media nacional <strong>(<%= media %>)</strong>."
  },
  jovenes_parados_normalizado: {
    before_negative: "Hay un",
    after_negative: "% menos de jóvenes parados respecto a la media nacional <strong>(<%= media %>)</strong>",
    before_positive: "Hay un",
    after_positive: "% mas de jóvenes parados respecto a la media nacional <strong>(<%= media %>)</strong>"
  },
  parados_larga_duracion_normalizado: {
    before_negative: "Hay un ",
    after_negative: "% menos de parados de larga duración respecto a la media nacional <strong>(<%= media %>)</strong>",
    before_positive: "Hay un ",
    after_positive: "% mas de parados de larga duración respecto a la media nacional <strong>(<%= media %>)</strong>"
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
  string = string.replace(/'/g,             '');
  string = string.replace(/\//g,            '');
  return string.toLowerCase();
}

