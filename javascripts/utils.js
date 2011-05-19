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
  'paro': 'paro_normalizado',
  'envejecimiento': 'envejecimiento_normalizado',
  'edad media': 'edad_media_normalizada',
  // 'inmigracion': 'inmigracion_normalizado',
  'saldo vegetativo': 'saldo_vegetativo_normalizado',
  'pib': 'pib_normalizado',
  'salario': 'salario_medio_normalizado'
  // 'secundaria acabada': 'secundaria_acabada_normalizado',
  // 'consumo tv': 'audiencia_diaria_tv_normalizado',
  // 'consumo prensa': 'prensa_diaria',
  // 'penetracion internet': 'penetracion_internet_normalizado'
};

var custom_map_style = [{featureType:"administrative.country",elementType:"all",stylers:[{saturation:-100},{visibility:"off"}]},{featureType:"administrative.province",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"all",stylers:[{lightness:7},{saturation:-91}]},{featureType:"all",elementType:"all",stylers:[]}];

var tooltipInfo = {
  "Envejecimiento" : {
    content: "Desviación respecto a la media del porcentaje de personas mayores de 65 años",
    left: "más mayores",
    right: "más jóvenes",
    legendTop: "Más % de mayores de 65 años",
    legendBottom:"Menos % de mayores de 65 años"
  },
  "Tasa de paro" : {
    content: "Desviación respecto a la media de la tasa de paro registrado",
    left: "más parados",
    right: "menos parados",
    legendTop: "Más % paro",
    legendBottom:"Menos % paro"
  },
  "PIB per cápita" : {
    content: "Desviación respecto a la media del producto interior bruto per cápita",
    left: "más pobres",
    right: "más ricos",
    legendTop: "Más PIB per cápita",
    legendBottom:"Menos PIB per cápita"
  },
  "Edad media" : {
    content: "Desviación respecto a la media de edad de cada municipio.",
    left: "más mayores",
    right: "más jóvenes",
    legendTop: "Más edad",
    legendBottom:"Menos edad"
  },
  "Inmigracion" : {
    content: "Desviación respecto a la media del % de inmigración",
    left: "menos inmigrantes",
    right: "más inmigrantes",
    legendTop: "Mayor % de inmigración",
    legendBottom:"Menor % de inmigración"
  },
  "Saldo Vegetativo" : {
    content: "Desviación respecto a la media del crecimiento de la población",
    left: "menor crecimiento",
    right: "mayor crecimiento",
    legendTop: "Mayor crecimiento",
    legendBottom:"Menor crecimiento"
  },
  "Salario medio" : {
    content: "Desviación respecto a la media del salario medio por habitante",
    left: "sueldos más bajos",
    right: "sueldos más altos",
    legendTop: "Sueldos más altos",
    legendBottom:"Sueldos más bajos"
  },
  "Estudios acabados" : {
    content: "Desviación respecto a la media del porcentaje de personas con estudios acabados",
    left: "menos habitantes",
    right: "más habitantes",
    legendTop: "más habitantes",
    legendBottom:"Menos habitantes"
  },
  "Penetración internet" : {
    content: "Desviación respecto a la media del porcentaje de personas acceso a internet",
    left: "menos habitantes",
    right: "más habitantes",
    legendTop: "más habitantes",
    legendBottom:"Menos habitantes"
  }
};

var textInfoWindow = {
  envejecimiento_normalizado : {
    before_negative: "Aquí hay un ",
    after_negative: "% menos de personas mayores de 65 años, que en el resto de España",
    before_positive: "Aquí hay un ",
    after_positive: "% más de personas mayores de 65 años, que en el resto de España"
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
  edad_media_normalizada : {
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
  estudios_acabados: {
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
  }
};

var explanationContent = {
  "Edad Media" : {
    htmlContent: "<h1>Edad media de la población</h1><p class='rango'>Datos disponibles a nivel de municipio entre X y Y</p><p>Cálculo de la edad media de la población a partir de los grupos quinquenales de distribución de edad del Instituto Nacional de Estadística, considerando el valor medio para cada tramo.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft20%2Fe245&file=inebase&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Envejecimiento" : {
    htmlContent: "<h1>Envejecimiento de la población</h1><p class='rango'>Datos disponibles a nivel provincial entre X y Y</p><p>Proporción existente entre el número de personas mayores y el de niños para una población determinada. Se calcula como el número de adultos mayores de 65 años por cada 100 niños menores de 15.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?per=12&type=db&divi=IDB&idtab=57'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Porcentaje de inmigración" : {
    htmlContent: "<h1>Porcentaje de inmigración</h1><p class='rango'>Datos disponibles a nivel de municipio entre X y Y</p><p>X.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft20%2Fe245%2F&file=inebase&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Saldo vegetativo" : {
    htmlContent: "<h1>Saldo vegetativo</h1><p class='rango'>Datos disponibles a nivel de provincia entre X y Y</p><p>Indicador demográfico básico que expresa el crecimiento natural de una población, calculado como el número de nacimientos menos el de defunciones por cada mil habitantes.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?per=12&type=db&divi=IDB&idtab=51'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Tasa de paro" : {
    htmlContent: "<h1>Tasa de paro</h1><p class='rango'>Datos disponibles a nivel de municipio entre X y Y</p><p>Paro registrado como porcentaje sobre la población total. Se muestra solamente para poblaciones superiores a 1000 habitantes.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.anuarieco.lacaixa.comunicacions.com/java/X?cgi=caixa.le_DEM.pattern&CLEAR=YES'>el Anuario Económico de España 2011 de La Caixa</a></p>"
  },
  "PIB per cápita" : {
    htmlContent: "<h1>PIB per cápita</h1><p class='rango'>Datos disponibles a nivel de provincia entre X y Y</p><p>Producto Interior Bruto a precios de mercado. Los valores correspondientes a los años 2007-2010 son estimaciones.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/cre00/serieh/cre00_sh.htm'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Salario medio" : {
    htmlContent: "<h1>Salario medio</h1><p class='rango'>Datos disponibles a nivel de comunidad entre X y Y</p><p>Salario medio calculado mediante la división de la remuneración total de los asalariados entre el número total de asalariados.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/daco/daco42/cre00/serieh/cre00_sh.htm'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Estudios acabados" : {
    htmlContent: "<h1>Estudios acabados</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre X y Y</p><p>Porcentaje de la población con la educación secundaria terminada.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.educacion.gob.es/mecd/jsp/plantilla.jsp?id=3131&area=estadisticas'>la web del Ministerio de Educación y Ciencia</a></p>"
  },
  "Consumo de TV" : {
    htmlContent: "<h1>Consumo de televisión</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre X y Y</p><p>Audiencia acumulada diaria como porcentaje sobre la población mayor de 14 años. Dato proporcionado por el Instituto Nacional de Estadística a partir de un estudio de AIMC.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?path=/t12/a110/a01/l0/&file=o40044.px&type=pcaxis&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Consumo de prensa" : {
    htmlContent: "<h1>Consumo de prensa</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre X y Y</p><p>Audiencia acumulada diaria como porcentaje sobre la población mayor de 14 años. Dato proporcionado por el Instituto Nacional de Estadística a partir de un estudio de AIMC.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.ine.es/jaxi/tabla.do?path=/t12/a110/a01/l0/&file=o40022.px&type=pcaxis&L=0'>la web del Instituto Nacional de Estadística</a></p>"
  },
  "Penetración de internet" : {
    htmlContent: "<h1>Penetración de internet</h1><p class='rango'>Datos disponibles a nivel de comunidad autónoma entre X y Y</p><p>Indicador de la penetración de Internet en la población española.</p><p class='fuente'>Puede acceder a los datos en bruto en <a href='http://www.aimc.es/-Audiencia-de-Internet-en-el-EGM-.html'>el Estudio General de Medios de la AIMC de Octubre / Noviembre de 2010.</a></p>"
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



var max_min={'municipios':{"inmigracion_normalizado_1999_max":"53804.21417","inmigracion_normalizado_1999_min":"-99.32182308","inmigracion_normalizado_2000_max":"58778.11781","inmigracion_normalizado_2000_min":"-99.40780779","inmigracion_normalizado_2001_max":"81369.1754","inmigracion_normalizado_2001_min":"-99.57644466","inmigracion_normalizado_2002_max":"112241.4682","inmigracion_normalizado_2002_min":"-100.0","inmigracion_normalizado_2003_max":"103191.5361","inmigracion_normalizado_2003_min":"-100.0","inmigracion_normalizado_2004_max":"100077.9728","inmigracion_normalizado_2004_min":"-100.0","inmigracion_normalizado_2005_max":"94489.8954","inmigracion_normalizado_2005_min":"-100.0","inmigracion_normalizado_2006_max":"85556.037","inmigracion_normalizado_2006_min":"-100.0","inmigracion_normalizado_2007_max":"85077.20071","inmigracion_normalizado_2007_min":"-100.0","inmigracion_normalizado_2008_max":"85210.14498","inmigracion_normalizado_2008_min":"-100.0","inmigracion_normalizado_2009_max":"84927.94417","inmigracion_normalizado_2009_min":"-100.0","inmigracion_normalizado_2010_max":"84931.01341","inmigracion_normalizado_2010_min":"-100.0","comercial_normalizado_2009_max":"8141.6573362","comercial_normalizado_2009_min":"-30.3426638","restauracion_normalizado_2009_max":"9479.74100277","restauracion_normalizado_2009_min":"-30.25899723","paro_normalizado_1996_max":"33.292523077","paro_normalizado_1996_min":"-5.107476923","paro_normalizado_1997_max":"14.272307692000002","paro_normalizado_1997_min":"-4.027692308","paro_normalizado_1998_max":"13.033138461999998","paro_normalizado_1998_min":"-3.866861538","paro_normalizado_1999_max":"10.071846154","paro_normalizado_1999_min":"-3.128153846","paro_normalizado_2000_max":"11.371507692","paro_normalizado_2000_min":"-3.128492308","paro_normalizado_2001_max":"10.569292308","paro_normalizado_2001_min":"-3.030707692","paro_normalizado_2002_max":"7.9223076919999995","paro_normalizado_2002_min":"-3.177692308","paro_normalizado_2003_max":"8.080892308000001","paro_normalizado_2003_min":"-3.219107692","paro_normalizado_2004_max":"10.0744","paro_normalizado_2004_min":"-3.3256","paro_normalizado_2005_max":"9.637938462","paro_normalizado_2005_min":"-4.062061538","paro_normalizado_2006_max":"10.105323077","paro_normalizado_2006_min":"-3.594676923","paro_normalizado_2007_max":"11.595509074","paro_normalizado_2007_min":"-3.404490926","paro_normalizado_2008_max":"12.53800738","paro_normalizado_2008_min":"-3.96199262","paro_normalizado_2009_max":"14.781119311000001","paro_normalizado_2009_min":"-5.718880689000001","edad_media_normalizada_2000_max":"33.77959596","edad_media_normalizada_2000_min":"-16.87587738","edad_media_normalizada_2001_max":"26.90128042","edad_media_normalizada_2001_min":"-17.00367045","edad_media_normalizada_2002_max":"28.88906304","edad_media_normalizada_2002_min":"-17.55736553","edad_media_normalizada_2003_max":"25.71648493","edad_media_normalizada_2003_min":"-17.64065793","edad_media_normalizada_2004_max":"25.92567842","edad_media_normalizada_2004_min":"-19.37590888","edad_media_normalizada_2005_max":"27.80099803","edad_media_normalizada_2005_min":"-17.83392261","edad_media_normalizada_2006_max":"24.26660291","edad_media_normalizada_2006_min":"-17.61473056","edad_media_normalizada_2007_max":"24.26660291","edad_media_normalizada_2007_min":"-17.61473056","edad_media_normalizada_2008_max":"24.24832802","edad_media_normalizada_2008_min":"-17.25342415","edad_media_normalizada_2009_max":"24.51554784","edad_media_normalizada_2009_min":"-16.94243614","edad_media_normalizada_2010_max":"55.63262380018611","edad_media_normalizada_2010_min":"-35.80024281912941","actividad_economica_normalizado_2009_max":"10555.20486004","actividad_economica_normalizado_2009_min":"-29.79513996"},"provincias":{"inmigracion_normalizado_1999_max":"811.7140844","inmigracion_normalizado_1999_min":"-96.39857449","inmigracion_normalizado_2000_max":"819.9836735","inmigracion_normalizado_2000_min":"-95.65623988","inmigracion_normalizado_2001_max":"969.1545598","inmigracion_normalizado_2001_min":"-94.76638551","inmigracion_normalizado_2002_max":"999.1513656","inmigracion_normalizado_2002_min":"-94.16464602","inmigracion_normalizado_2003_max":"1000.338416","inmigracion_normalizado_2003_min":"-94.57867516","inmigracion_normalizado_2004_max":"996.8127725","inmigracion_normalizado_2004_min":"-94.37458275","inmigracion_normalizado_2005_max":"957.7453089","inmigracion_normalizado_2005_min":"-94.35061132","inmigracion_normalizado_2006_max":"891.7781092","inmigracion_normalizado_2006_min":"-94.22559266","inmigracion_normalizado_2007_max":"892.9923335","inmigracion_normalizado_2007_min":"-93.93728715","inmigracion_normalizado_2008_max":"896.556952","inmigracion_normalizado_2008_min":"-93.8919962","inmigracion_normalizado_2009_max":"893.222438","inmigracion_normalizado_2009_min":"-93.88587995","inmigracion_normalizado_2010_max":"898.3970458","inmigracion_normalizado_2010_min":"-93.5332481","comercial_normalizado_2009_max":"12634.942308","comercial_normalizado_2009_min":"-1766.057692","restauracion_normalizado_2009_max":"13359.903846","restauracion_normalizado_2009_min":"-1850.096154","paro_normalizado_1996_max":"2.9961538459999995","paro_normalizado_1996_min":"-3.203846154","paro_normalizado_1997_max":"2.978846154","paro_normalizado_1997_min":"-2.821153846","paro_normalizado_1998_max":"2.757692308","paro_normalizado_1998_min":"-2.542307692","paro_normalizado_1999_max":"2.6769230769999997","paro_normalizado_1999_min":"-2.223076923","paro_normalizado_2000_max":"2.5211538460000003","paro_normalizado_2000_min":"-2.078846154","paro_normalizado_2001_max":"2.442307692","paro_normalizado_2001_min":"-1.857692308","paro_normalizado_2002_max":"2.801923077","paro_normalizado_2002_min":"-1.8980769229999999","paro_normalizado_2003_max":"2.734615385","paro_normalizado_2003_min":"-1.865384615","paro_normalizado_2004_max":"2.734615385","paro_normalizado_2004_min":"-1.9653846149999998","paro_normalizado_2005_max":"4.465384615","paro_normalizado_2005_min":"-2.1346153850000005","paro_normalizado_2006_max":"5.875","paro_normalizado_2006_min":"-2.2250000000000005","paro_normalizado_2007_max":"6.4461538460000005","paro_normalizado_2007_min":"-2.2538461539999997","paro_normalizado_2008_max":"6.694230769000001","paro_normalizado_2008_min":"-2.7057692309999997","paro_normalizado_2009_max":"5.199999999999999","paro_normalizado_2009_min":"-3.3000000000000007","pib_normalizado_1999_max":"51.9495295","pib_normalizado_1999_min":"-33.008176","pib_normalizado_2000_max":"47.6542846","pib_normalizado_2000_min":"-32.0999647","pib_normalizado_2001_max":"47.8727659","pib_normalizado_2001_min":"-31.7429628","pib_normalizado_2002_max":"49.2340151","pib_normalizado_2002_min":"-31.4131239","pib_normalizado_2003_max":"47.457627","pib_normalizado_2003_min":"-29.8641702","pib_normalizado_2004_max":"47.9353221","pib_normalizado_2004_min":"-30.7208999","pib_normalizado_2005_max":"49.8525568","pib_normalizado_2005_min":"-31.7395672","pib_normalizado_2006_max":"53.6123781","pib_normalizado_2006_min":"-32.0961884","pib_normalizado_2007_max":"54.4282007","pib_normalizado_2007_min":"-31.5201908","pib_normalizado_2008_max":"57.5141341","pib_normalizado_2008_min":"-31.538218","lineas_adsl_2007_max":"22.5","lineas_adsl_2007_min":"9.6","lineas_adsl_2008_max":"24.5","lineas_adsl_2008_min":"11.2","lineas_adsl_2009_max":"25.2","lineas_adsl_2009_min":"13.0","edad_media_normalizada_2000_max":"5.204660487","edad_media_normalizada_2000_min":"-6.413715953","edad_media_normalizada_2001_max":"5.224604037","edad_media_normalizada_2001_min":"-7.024132943","edad_media_normalizada_2002_max":"5.610531727","edad_media_normalizada_2002_min":"-7.137120543","edad_media_normalizada_2003_max":"5.78081224","edad_media_normalizada_2003_min":"-6.98280999","edad_media_normalizada_2004_max":"5.917905758","edad_media_normalizada_2004_min":"-6.903097372","edad_media_normalizada_2005_max":"6.098289765","edad_media_normalizada_2005_min":"-6.784742305","edad_media_normalizada_2006_max":"6.208920787","edad_media_normalizada_2006_min":"-6.710838023","edad_media_normalizada_2007_max":"6.327599208","edad_media_normalizada_2007_min":"-6.872234942","edad_media_normalizada_2008_max":"6.486507507","edad_media_normalizada_2008_min":"-6.783086133","edad_media_normalizada_2009_max":"6.492910405","edad_media_normalizada_2009_min":"-6.851838185","edad_media_normalizada_2010_max":"7.727558218","edad_media_normalizada_2010_min":"-5.752743651","envejecimiento_normalizado_1991_max":"64.73225725000002","envejecimiento_normalizado_1991_min":"-42.71275274999999","envejecimiento_normalizado_1992_max":"66.40668011999999","envejecimiento_normalizado_1992_min":"-46.08082488","envejecimiento_normalizado_1993_max":"68.68034048","envejecimiento_normalizado_1993_min":"-49.962535519999996","envejecimiento_normalizado_1994_max":"70.30731418999999","envejecimiento_normalizado_1994_min":"-54.167616810000006","envejecimiento_normalizado_1995_max":"75.37371693999998","envejecimiento_normalizado_1995_min":"-58.413764060000005","envejecimiento_normalizado_1996_max":"82.17899539999999","envejecimiento_normalizado_1996_min":"-62.8936186","envejecimiento_normalizado_1997_max":"88.4542744","envejecimiento_normalizado_1997_min":"-67.39238259999999","envejecimiento_normalizado_1998_max":"96.02741670000002","envejecimiento_normalizado_1998_min":"-71.7870943","envejecimiento_normalizado_1999_max":"102.25105809999998","envejecimiento_normalizado_1999_min":"-76.20118590000001","envejecimiento_normalizado_2000_max":"109.3978266","envejecimiento_normalizado_2000_min":"-79.9938094","envejecimiento_normalizado_2001_max":"116.271042","envejecimiento_normalizado_2001_min":"-83.01349300000001","envejecimiento_normalizado_2002_max":"123.18276650000001","envejecimiento_normalizado_2002_min":"-85.1642745","envejecimiento_normalizado_2003_max":"129.61833170000003","envejecimiento_normalizado_2003_min":"-84.29416229999998","envejecimiento_normalizado_2004_max":"133.70450089999997","envejecimiento_normalizado_2004_min":"-84.02681510000002","envejecimiento_normalizado_2005_max":"137.6368495","envejecimiento_normalizado_2005_min":"-83.44062149999999","envejecimiento_normalizado_2006_max":"138.340721","envejecimiento_normalizado_2006_min":"-81.81769299999999","envejecimiento_normalizado_2007_max":"141.5187698","envejecimiento_normalizado_2007_min":"-81.12850820000001","envejecimiento_normalizado_2008_max":"144.3995553","envejecimiento_normalizado_2008_min":"-79.5814437","envejecimiento_normalizado_2009_max":"145.2876746","envejecimiento_normalizado_2009_min":"-78.60539540000002","envejecimiento_normalizado_2010_max":"145.4636059","envejecimiento_normalizado_2010_min":"-79.5995621","envejecimiento_normalizado_2011_max":"146.28521859999998","envejecimiento_normalizado_2011_min":"-80.4743334","actividad_economica_normalizado_2009_max":"15137.942308","actividad_economica_normalizado_2009_min":"-1837.057692","saldo_vegetativo_normalizado_1975_max":"8.153810714","saldo_vegetativo_normalizado_1975_min":"-9.581943286","saldo_vegetativo_normalizado_1976_max":"7.105920571","saldo_vegetativo_normalizado_1976_min":"-9.633519429","saldo_vegetativo_normalizado_1977_max":"7.355436","saldo_vegetativo_normalizado_1977_min":"-8.939484","saldo_vegetativo_normalizado_1978_max":"6.964609286","saldo_vegetativo_normalizado_1978_min":"-8.454792714","saldo_vegetativo_normalizado_1979_max":"6.693806857","saldo_vegetativo_normalizado_1979_min":"-7.630613143","saldo_vegetativo_normalizado_1980_max":"6.163184286","saldo_vegetativo_normalizado_1980_min":"-7.810327714","saldo_vegetativo_normalizado_1981_max":"6.158293286","saldo_vegetativo_normalizado_1981_min":"-7.635588714","saldo_vegetativo_normalizado_1982_max":"5.484745","saldo_vegetativo_normalizado_1982_min":"-8.159886","saldo_vegetativo_normalizado_1983_max":"5.814161571","saldo_vegetativo_normalizado_1983_min":"-7.526067429","saldo_vegetativo_normalizado_1984_max":"5.015375286","saldo_vegetativo_normalizado_1984_min":"-7.141857714","saldo_vegetativo_normalizado_1985_max":"6.415117143","saldo_vegetativo_normalizado_1985_min":"-7.775783857","saldo_vegetativo_normalizado_1986_max":"6.822959429","saldo_vegetativo_normalizado_1986_min":"-7.633211571","saldo_vegetativo_normalizado_1987_max":"6.833517714","saldo_vegetativo_normalizado_1987_min":"-7.285510286","saldo_vegetativo_normalizado_1988_max":"7.525964143","saldo_vegetativo_normalizado_1988_min":"-7.833982857","saldo_vegetativo_normalizado_1989_max":"7.574911286","saldo_vegetativo_normalizado_1989_min":"-8.165667714","saldo_vegetativo_normalizado_1990_max":"8.445633857","saldo_vegetativo_normalizado_1990_min":"-8.784059143","saldo_vegetativo_normalizado_1991_max":"9.202587","saldo_vegetativo_normalizado_1991_min":"-8.377752","saldo_vegetativo_normalizado_1992_max":"11.95101043","saldo_vegetativo_normalizado_1992_min":"-8.292340571","saldo_vegetativo_normalizado_1993_max":"11.15193214","saldo_vegetativo_normalizado_1993_min":"-7.209274857","saldo_vegetativo_normalizado_1994_max":"9.030627","saldo_vegetativo_normalizado_1994_min":"-7.713369","saldo_vegetativo_normalizado_1995_max":"9.838327286","saldo_vegetativo_normalizado_1995_min":"-8.709387714","saldo_vegetativo_normalizado_1996_max":"9.330510286","saldo_vegetativo_normalizado_1996_min":"-8.970867714","saldo_vegetativo_normalizado_1997_max":"9.027667","saldo_vegetativo_normalizado_1997_min":"-8.770458","saldo_vegetativo_normalizado_1998_max":"9.030429857","saldo_vegetativo_normalizado_1998_min":"-8.344017143","saldo_vegetativo_normalizado_1999_max":"9.257666429","saldo_vegetativo_normalizado_1999_min":"-9.333486571","saldo_vegetativo_normalizado_2000_max":"9.420708","saldo_vegetativo_normalizado_2000_min":"-9.122656","saldo_vegetativo_normalizado_2001_max":"10.06953586","saldo_vegetativo_normalizado_2001_min":"-9.495204143","saldo_vegetativo_normalizado_2002_max":"8.085264286","saldo_vegetativo_normalizado_2002_min":"-9.393833714","saldo_vegetativo_normalizado_2003_max":"8.669946857","saldo_vegetativo_normalizado_2003_min":"-9.632414143","saldo_vegetativo_normalizado_2004_max":"6.581991571","saldo_vegetativo_normalizado_2004_min":"-9.307584429","saldo_vegetativo_normalizado_2005_max":"7.698343714","saldo_vegetativo_normalizado_2005_min":"-9.586495286","saldo_vegetativo_normalizado_2006_max":"7.875102143","saldo_vegetativo_normalizado_2006_min":"-10.20713986","saldo_vegetativo_normalizado_2007_max":"8.273945143","saldo_vegetativo_normalizado_2007_min":"-9.817765857","saldo_vegetativo_normalizado_2008_max":"8.961384571","saldo_vegetativo_normalizado_2008_min":"-10.30389443","saldo_vegetativo_normalizado_2009_max":"10.42256571","saldo_vegetativo_normalizado_2009_min":"-9.846663286"},"autonomias":{"inmigracion_normalizado_1999_max":"233.1268292","inmigracion_normalizado_1999_min":"-92.76250839","inmigracion_normalizado_2000_max":"236.1474241","inmigracion_normalizado_2000_min":"-92.81786454","inmigracion_normalizado_2001_max":"290.6526276","inmigracion_normalizado_2001_min":"-94.33262072","inmigracion_normalizado_2002_max":"301.6126893","inmigracion_normalizado_2002_min":"-95.51817003","inmigracion_normalizado_2003_max":"302.0467291","inmigracion_normalizado_2003_min":"-96.49795303","inmigracion_normalizado_2004_max":"300.758513","inmigracion_normalizado_2004_min":"-96.95644547","inmigracion_normalizado_2005_max":"286.4838629","inmigracion_normalizado_2005_min":"-97.32099673","inmigracion_normalizado_2006_max":"292.2215915","inmigracion_normalizado_2006_min":"-97.42431302","inmigracion_normalizado_2007_max":"285.789543","inmigracion_normalizado_2007_min":"-97.57451105","inmigracion_normalizado_2008_max":"278.655091","inmigracion_normalizado_2008_min":"-97.76822938","inmigracion_normalizado_2009_max":"281.3643799","inmigracion_normalizado_2009_min":"-97.7659946","inmigracion_normalizado_2010_max":"278.1115024","inmigracion_normalizado_2010_min":"-97.63714835","comercial_normalizado_2009_max":"12087.842105","comercial_normalizado_2009_min":"-5036.157894999999","restauracion_normalizado_2009_max":"10738.842105","restauracion_normalizado_2009_min":"-5190.157894999999","secundaria_acabada_normalizado_2004_max":"29.90679095","secundaria_acabada_normalizado_2004_min":"-23.06258322","secundaria_acabada_normalizado_2005_max":"25.14590206","secundaria_acabada_normalizado_2005_min":"-26.23699569","secundaria_acabada_normalizado_2006_max":"25.44173978","secundaria_acabada_normalizado_2006_min":"-26.8256518","secundaria_acabada_normalizado_2007_max":"26.86031709","secundaria_acabada_normalizado_2007_min":"-29.17486402","secundaria_acabada_normalizado_2008_max":"29.66101695","secundaria_acabada_normalizado_2008_min":"-27.64544205","secundaria_acabada_normalizado_2009_max":"28.6985173","secundaria_acabada_normalizado_2009_min":"-25.27182867","secundaria_acabada_normalizado_2010_max":"28.6985173","secundaria_acabada_normalizado_2010_min":"-25.27182867","secundaria_acabada_normalizado_2011_max":"26.4970222","secundaria_acabada_normalizado_2011_min":"-24.56957228","paro_normalizado_1996_max":"1.4631578950000002","paro_normalizado_1996_min":"-1.3368421050000006","paro_normalizado_1997_max":"2.1052631580000005","paro_normalizado_1997_min":"-2.3947368419999995","paro_normalizado_1998_max":"2.6736842110000003","paro_normalizado_1998_min":"-1.8263157889999997","paro_normalizado_1999_max":"1.3736842110000005","paro_normalizado_1999_min":"-2.226315789","paro_normalizado_2000_max":"1.5421052629999998","paro_normalizado_2000_min":"-2.057894737","paro_normalizado_2001_max":"1.5368421050000003","paro_normalizado_2001_min":"-1.963157895","paro_normalizado_2002_max":"1.2894736839999998","paro_normalizado_2002_min":"-1.8105263159999998","paro_normalizado_2003_max":"1.5684210530000002","paro_normalizado_2003_min":"-1.631578947","paro_normalizado_2004_max":"2.252631579","paro_normalizado_2004_min":"-1.6473684210000004","paro_normalizado_2005_max":"3.221052632","paro_normalizado_2005_min":"-1.978947368","paro_normalizado_2006_max":"5.268421053","paro_normalizado_2006_min":"-2.2315789469999996","paro_normalizado_2007_max":"4.947368420999999","paro_normalizado_2007_min":"-2.152631579","paro_normalizado_2008_max":"5.078947368","paro_normalizado_2008_min":"-2.421052632","paro_normalizado_2009_max":"4.136842105","paro_normalizado_2009_min":"-2.3631578950000005","penetracion_internet_normalizado_2004_max":"27.8887437","penetracion_internet_normalizado_2004_min":"-24.4726526","penetracion_internet_normalizado_2005_max":"34.20259003","penetracion_internet_normalizado_2005_min":"-32.74791556","penetracion_internet_normalizado_2006_max":"30.44484869","penetracion_internet_normalizado_2006_min":"-43.77377212","penetracion_internet_normalizado_2007_max":"29.37283802","penetracion_internet_normalizado_2007_min":"-37.6146789","penetracion_internet_normalizado_2008_max":"23.85908727","penetracion_internet_normalizado_2008_min":"-23.77902322","penetracion_internet_normalizado_2009_max":"20.63842848","penetracion_internet_normalizado_2009_min":"-25.07059546","penetracion_internet_normalizado_2010_max":"15.37422622","penetracion_internet_normalizado_2010_min":"-16.00450197","pib_normalizado_1999_max":"39.0646724","pib_normalizado_1999_min":"-36.0467234","pib_normalizado_2000_max":"40.2902974","pib_normalizado_2000_min":"-35.2768927","pib_normalizado_2001_max":"39.4121579","pib_normalizado_2001_min":"-34.7088511","pib_normalizado_2002_max":"38.4200661","pib_normalizado_2002_min":"-33.3679001","pib_normalizado_2003_max":"36.0681121","pib_normalizado_2003_min":"-31.9911224","pib_normalizado_2004_max":"35.8295984","pib_normalizado_2004_min":"-31.2473282","pib_normalizado_2005_max":"34.4617843","pib_normalizado_2005_min":"-30.7314775","pib_normalizado_2006_max":"35.8944403","pib_normalizado_2006_min":"-32.0583743","pib_normalizado_2007_max":"35.2462782","pib_normalizado_2007_min":"-34.4513002","pib_normalizado_2008_max":"36.9224692","pib_normalizado_2008_min":"-34.1380146","uso_regular_internet_2003_max":"43.9","uso_regular_internet_2003_min":"24.43","uso_regular_internet_2004_max":"49.5","uso_regular_internet_2004_min":"32.0","uso_regular_internet_2005_max":"54.9","uso_regular_internet_2005_min":"36.3","uso_regular_internet_2006_max":"58.6","uso_regular_internet_2006_min":"34.5","uso_regular_internet_2007_max":"63.8","uso_regular_internet_2007_min":"39.5","uso_regular_internet_2008_max":"67.0","uso_regular_internet_2008_min":"43.5","uso_regular_internet_2009_max":"0.0","uso_regular_internet_2009_min":"0.0","uso_regular_internet_2010_max":"71.8","uso_regular_internet_2010_min":"53.6","prensa_diaria_normalizado_2000_max":"49.44509346","prensa_diaria_normalizado_2000_min":"-51.34345794","prensa_diaria_normalizado_2001_max":"45.71428571","prensa_diaria_normalizado_2001_min":"-50.40601504","prensa_diaria_normalizado_2002_max":"49.30390995","prensa_diaria_normalizado_2002_min":"-44.60900474","prensa_diaria_normalizado_2003_max":"42.08176364","prensa_diaria_normalizado_2003_min":"-46.86758755","prensa_diaria_normalizado_2004_max":"32.91327913","prensa_diaria_normalizado_2004_min":"-40.79945799","prensa_diaria_normalizado_2005_max":"38.66155741","prensa_diaria_normalizado_2005_min":"-38.34679075","prensa_diaria_normalizado_2006_max":"39.49299533","prensa_diaria_normalizado_2006_min":"-37.62508339","prensa_diaria_normalizado_2007_max":"37.62230264","prensa_diaria_normalizado_2007_min":"-36.42943305","prensa_diaria_normalizado_2008_max":"37.81966781","prensa_diaria_normalizado_2008_min":"-40.16609544","prensa_diaria_normalizado_2009_max":"34.76889316","prensa_diaria_normalizado_2009_min":"-36.5793444","audiencia_diaria_tv_normalizado_1997_max":"6.318859365","audiencia_diaria_tv_normalizado_1997_min":"-4.147764096","audiencia_diaria_tv_normalizado_1998_max":"4.248992269","audiencia_diaria_tv_normalizado_1998_min":"-4.063966167","audiencia_diaria_tv_normalizado_1999_max":"6.656122314","audiencia_diaria_tv_normalizado_1999_min":"-6.227758007","audiencia_diaria_tv_normalizado_2000_max":"5.130400421","audiencia_diaria_tv_normalizado_2000_min":"-3.714436249","audiencia_diaria_tv_normalizado_2001_max":"5.008909127","audiencia_diaria_tv_normalizado_2001_min":"-5.649046393","audiencia_diaria_tv_normalizado_2002_max":"2.952897367","audiencia_diaria_tv_normalizado_2002_min":"-4.932383877","audiencia_diaria_tv_normalizado_2003_max":"4.520396913","audiencia_diaria_tv_normalizado_2003_min":"-5.512679162","audiencia_diaria_tv_normalizado_2004_max":"4.522810697","audiencia_diaria_tv_normalizado_2004_min":"-4.168851599","audiencia_diaria_tv_normalizado_2005_max":"4.681189168","audiencia_diaria_tv_normalizado_2005_min":"-3.760842217","audiencia_diaria_tv_normalizado_2006_max":"5.718856229","audiencia_diaria_tv_normalizado_2006_min":"-4.365793508","audiencia_diaria_tv_normalizado_2007_max":"6.474392819","audiencia_diaria_tv_normalizado_2007_min":"-4.857444562","audiencia_diaria_tv_normalizado_2008_max":"5.262808601","audiencia_diaria_tv_normalizado_2008_min":"-5.568091319","audiencia_diaria_tv_normalizado_2009_max":"3.420775112","audiencia_diaria_tv_normalizado_2009_min":"-4.310572107","salario_medio_normalizado_1995_max":"18.20570446","salario_medio_normalizado_1995_min":"-20.18228733","salario_medio_normalizado_1996_max":"17.72180768","salario_medio_normalizado_1996_min":"-17.73951634","salario_medio_normalizado_1997_max":"18.14033086","salario_medio_normalizado_1997_min":"-16.47281908","salario_medio_normalizado_1998_max":"17.24148632","salario_medio_normalizado_1998_min":"-16.37822237","salario_medio_normalizado_1999_max":"17.38736068","salario_medio_normalizado_1999_min":"-16.31005678","salario_medio_normalizado_2000_max":"17.13760261","salario_medio_normalizado_2000_min":"-15.09977778","salario_medio_normalizado_2001_max":"16.42474207","salario_medio_normalizado_2001_min":"-14.77185542","salario_medio_normalizado_2002_max":"14.96799991","salario_medio_normalizado_2002_min":"-14.46932702","salario_medio_normalizado_2003_max":"14.26976184","salario_medio_normalizado_2003_min":"-14.78151364","salario_medio_normalizado_2004_max":"14.5648906","salario_medio_normalizado_2004_min":"-15.05209339","salario_medio_normalizado_2005_max":"14.56378824","salario_medio_normalizado_2005_min":"-13.84187995","salario_medio_normalizado_2006_max":"14.23212283","salario_medio_normalizado_2006_min":"-12.77410372","salario_medio_normalizado_2007_max":"14.73691373","salario_medio_normalizado_2007_min":"-12.75975699","salario_medio_normalizado_2008_max":"15.46538295","salario_medio_normalizado_2008_min":"-11.11086687","salario_medio_normalizado_2009_max":"15.6806683","salario_medio_normalizado_2009_min":"-9.848004397","edad_media_normalizada_2000_max":"3.655239961","edad_media_normalizada_2000_min":"-5.377298839","edad_media_normalizada_2001_max":"3.789454429","edad_media_normalizada_2001_min":"-5.271834181","edad_media_normalizada_2002_max":"4.059868007","edad_media_normalizada_2002_min":"-5.243350613","edad_media_normalizada_2003_max":"4.215266294","edad_media_normalizada_2003_min":"-5.098190416","edad_media_normalizada_2004_max":"4.355987705","edad_media_normalizada_2004_min":"-5.045427405","edad_media_normalizada_2005_max":"4.450373149","edad_media_normalizada_2005_min":"-5.037023151","edad_media_normalizada_2006_max":"4.540863551","edad_media_normalizada_2006_min":"-5.080378399","edad_media_normalizada_2007_max":"4.655369058","edad_media_normalizada_2007_min":"-5.117607422","edad_media_normalizada_2008_max":"4.758079272","edad_media_normalizada_2008_min":"-5.056298088","edad_media_normalizada_2009_max":"4.754892919","edad_media_normalizada_2009_min":"-5.064411121","edad_media_normalizada_2010_max":"5.127083209","edad_media_normalizada_2010_min":"-4.894495729","envejecimiento_normalizado_1991_max":"32.18415068","envejecimiento_normalizado_1991_min":"-32.76435732","envejecimiento_normalizado_1992_max":"33.99887516000001","envejecimiento_normalizado_1992_min":"-35.27612283999999","envejecimiento_normalizado_1993_max":"35.674138420000006","envejecimiento_normalizado_1993_min":"-38.14460157999999","envejecimiento_normalizado_1994_max":"37.50815389","envejecimiento_normalizado_1994_min":"-41.252824110000006","envejecimiento_normalizado_1995_max":"41.98696937","envejecimiento_normalizado_1995_min":"-44.63527863","envejecimiento_normalizado_1996_max":"47.226087320000005","envejecimiento_normalizado_1996_min":"-48.268478679999994","envejecimiento_normalizado_1997_max":"52.67124742","envejecimiento_normalizado_1997_min":"-51.58647958","envejecimiento_normalizado_1998_max":"58.5110729","envejecimiento_normalizado_1998_min":"-55.01555510000001","envejecimiento_normalizado_1999_max":"64.4758235","envejecimiento_normalizado_1999_min":"-58.2196435","envejecimiento_normalizado_2000_max":"70.33345120000001","envejecimiento_normalizado_2000_min":"-61.00045279999999","envejecimiento_normalizado_2001_max":"75.65395040000001","envejecimiento_normalizado_2001_min":"-63.1323096","envejecimiento_normalizado_2002_max":"80.60472189999999","envejecimiento_normalizado_2002_min":"-64.6793071","envejecimiento_normalizado_2003_max":"83.81165179999999","envejecimiento_normalizado_2003_min":"-63.054563200000004","envejecimiento_normalizado_2004_max":"85.2757375","envejecimiento_normalizado_2004_min":"-61.7203325","envejecimiento_normalizado_2005_max":"85.9560578","envejecimiento_normalizado_2005_min":"-60.28863419999999","envejecimiento_normalizado_2006_max":"85.9297108","envejecimiento_normalizado_2006_min":"-58.456290200000005","envejecimiento_normalizado_2007_max":"85.43238039999999","envejecimiento_normalizado_2007_min":"-56.616912600000006","envejecimiento_normalizado_2008_max":"84.25462780000001","envejecimiento_normalizado_2008_min":"-54.582419200000004","envejecimiento_normalizado_2009_max":"83.3446733","envejecimiento_normalizado_2009_min":"-53.5836607","envejecimiento_normalizado_2010_max":"82.06805070000001","envejecimiento_normalizado_2010_min":"-54.07100629999999","envejecimiento_normalizado_2011_max":"80.79810119999999","envejecimiento_normalizado_2011_min":"-54.8356558","actividad_economica_normalizado_2009_max":"14272.789474000001","actividad_economica_normalizado_2009_min":"-5173.210526","saldo_vegetativo_normalizado_1975_max":"6.488659368","saldo_vegetativo_normalizado_1975_min":"-4.192354632","saldo_vegetativo_normalizado_1976_max":"5.557855895","saldo_vegetativo_normalizado_1976_min":"-4.219742105","saldo_vegetativo_normalizado_1977_max":"5.124190053","saldo_vegetativo_normalizado_1977_min":"-3.992370947","saldo_vegetativo_normalizado_1978_max":"4.694600474","saldo_vegetativo_normalizado_1978_min":"-3.439735526","saldo_vegetativo_normalizado_1979_max":"5.007359368","saldo_vegetativo_normalizado_1979_min":"-3.278948632","saldo_vegetativo_normalizado_1980_max":"4.942743474","saldo_vegetativo_normalizado_1980_min":"-3.462595526","saldo_vegetativo_normalizado_1981_max":"4.854011105","saldo_vegetativo_normalizado_1981_min":"-3.185323895","saldo_vegetativo_normalizado_1982_max":"4.214199211","saldo_vegetativo_normalizado_1982_min":"-3.823497789","saldo_vegetativo_normalizado_1983_max":"4.735850316","saldo_vegetativo_normalizado_1983_min":"-3.672156684","saldo_vegetativo_normalizado_1984_max":"4.242721421","saldo_vegetativo_normalizado_1984_min":"-3.818678579","saldo_vegetativo_normalizado_1985_max":"5.493121632","saldo_vegetativo_normalizado_1985_min":"-4.109254368","saldo_vegetativo_normalizado_1986_max":"4.976700526","saldo_vegetativo_normalizado_1986_min":"-3.780633474","saldo_vegetativo_normalizado_1987_max":"6.13436","saldo_vegetativo_normalizado_1987_min":"-4.457621","saldo_vegetativo_normalizado_1988_max":"7.258649053","saldo_vegetativo_normalizado_1988_min":"-5.147292947","saldo_vegetativo_normalizado_1989_max":"5.960353737","saldo_vegetativo_normalizado_1989_min":"-5.238208263","saldo_vegetativo_normalizado_1990_max":"5.248580474","saldo_vegetativo_normalizado_1990_min":"-5.364014526","saldo_vegetativo_normalizado_1991_max":"6.494483632","saldo_vegetativo_normalizado_1991_min":"-5.298972368","saldo_vegetativo_normalizado_1992_max":"6.978682263","saldo_vegetativo_normalizado_1992_min":"-5.687531737","saldo_vegetativo_normalizado_1993_max":"8.166377421","saldo_vegetativo_normalizado_1993_min":"-5.932460579","saldo_vegetativo_normalizado_1994_max":"6.564876105","saldo_vegetativo_normalizado_1994_min":"-5.365549895","saldo_vegetativo_normalizado_1995_max":"7.807042368","saldo_vegetativo_normalizado_1995_min":"-5.836605632","saldo_vegetativo_normalizado_1996_max":"5.846628947","saldo_vegetativo_normalizado_1996_min":"-5.786155053","saldo_vegetativo_normalizado_1997_max":"6.767395684","saldo_vegetativo_normalizado_1997_min":"-5.703736316","saldo_vegetativo_normalizado_1998_max":"6.050333526","saldo_vegetativo_normalizado_1998_min":"-5.909575474","saldo_vegetativo_normalizado_1999_max":"6.907133105","saldo_vegetativo_normalizado_1999_min":"-6.183955895","saldo_vegetativo_normalizado_2000_max":"6.553244158","saldo_vegetativo_normalizado_2000_min":"-6.418609842","saldo_vegetativo_normalizado_2001_max":"5.968768105","saldo_vegetativo_normalizado_2001_min":"-6.136802895","saldo_vegetativo_normalizado_2002_max":"5.939496421","saldo_vegetativo_normalizado_2002_min":"-6.619153579","saldo_vegetativo_normalizado_2003_max":"5.891632211","saldo_vegetativo_normalizado_2003_min":"-6.714681789","saldo_vegetativo_normalizado_2004_max":"6.206250947","saldo_vegetativo_normalizado_2004_min":"-6.808528053","saldo_vegetativo_normalizado_2005_max":"6.283871474","saldo_vegetativo_normalizado_2005_min":"-6.604552526","saldo_vegetativo_normalizado_2006_max":"5.550167526","saldo_vegetativo_normalizado_2006_min":"-6.791946474","saldo_vegetativo_normalizado_2007_max":"6.149897263","saldo_vegetativo_normalizado_2007_min":"-6.758861737","saldo_vegetativo_normalizado_2008_max":"6.416898895","saldo_vegetativo_normalizado_2008_min":"-7.083433105","saldo_vegetativo_normalizado_2009_max":"5.896081579","saldo_vegetativo_normalizado_2009_min":"-6.699033421"}}
