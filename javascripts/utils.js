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
  "PIB per capita" : {
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
    after_negative: " menos de personas mayores de 65 años, que en el resto de España",
    before_positive: "Aquí hay un ",
    after_positive: " más de personas mayores de 65 años, que en el resto de España"
  },
  paro_normalizado : {
    before_negative: "La tasa de paro se encuentra a un ",
    after_negative: " por debajo de la media",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: " por encima de la media"
  },
  pib_normalizado : {
    before_negative: "El PIB per cápita aquí es un ",
    after_negative: " más bajo que la media nacional",
    before_positive: "El PIB per cápita aquí es un ",
    after_positive: " más alto que la media nacional"
  },
  edad_media_normalizada : {
    before_negative: "Su población es ",
    after_negative: " años más jóven que la media nacional",
    before_positive: "Su población es ",
    after_positive: " años más mayor que la media nacional"
  },
  inmigracion_normalizado : {
    before_negative: "El porcentaje de inmigración en este municipio está ",
    after_negative: " por debajo de la media",
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_positive: " por encima de la media"
  },
  saldo_vegetativo_normalizado : {
    before_negative: "El crecimiento de la población está un ",
    after_negative: " por debajo de la media",
    before_positive: "El crecimiento de la población está un ",
    after_positive: " por encima de la media"
  },
  salario_medio_normalizado : {
    before_negative: "El salario medio aquí está un ",
    after_negative: " por debajo de la media",
    before_positive: "El salario medio aquí está un ",
    after_positive: " por encima de la media"
  },
  estudios_acabados: {
    before_negative: "Un ",
    after_negative: " menos que la media nacional, tiene los estudios secundarios terminados",
    before_positive: "Un ",
    after_positive: " más que la media nacional, tiene los estudios secundarios terminados"
  },
  penetracion_internet_normalizado: {
    before_negative: "Un ",
    after_negative: " menos que la media, tiene acceso a internet aquí",
    before_positive: "Un ",
    after_positive: " más que la media, tiene acceso a internet aquí"
  }
};

var explanationContent = {
  "Edad Media" : {
    htmlContent: "<h1>Edad Media de la Población</h1><p>La edad  media de la población española se ha calculado en base a los datos de población inlcuidos en el censo nacional y publicados en la página web del INE.</p><p>Para calcular la edad media hemos multiplicado el valor medio de cada quinquenio por el número de personas situadas en ese rango, para después, volver a dividir entre el total.</p>"
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

