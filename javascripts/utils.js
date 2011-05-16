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
  'envejecimiento': 'envejecimiento_normalizado'
};

var custom_map_style = [{featureType:"administrative.country",elementType:"all",stylers:[{saturation:-100},{visibility:"off"}]},{featureType:"administrative.province",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"all",stylers:[{lightness:7},{saturation:-91}]},{featureType:"all",elementType:"all",stylers:[]}];

var tooltipInfo = {
  "Envejecimiento" : {
    content: "Desviación respecto a la media de edad de cada municipio.",
    left: "más mayores",
    right: "más jóvenes",
    legendTop: "Más edad",
    legendBottom:"Menos edad"
  },
  "Edad media" : {
    content: "Desviación respecto a la media de edad de cada municipio.",
    left: "más mayores",
    right: "más jóvenes",
    legendTop: "Más edad",
    legendBottom:"Menos edad"
  },
  "PIB per cápita" : {
    content: "Desviación respecto a la media de edad de cada municipio.",
    left: "más mayores",
    right: "más jóvenes",
    legendTop: "Más % PIB ",
    legendBottom:"Menos % PIB"
  },
  "Tasa de paro" : {
    content: "Lorem ipsum dolor sit amet de, consectetur adipiscing elit. Donec vel libero ipsum, nec commodo ipsum. Sed elementum, odio et congue.",
    left: "más parados",
    right: "menos parados",
    legendTop: "Más % paro",
    legendBottom:"Menos % paro"
  }
};

var textInfoWindow = {
  "Envejecimiento" : {
    before_positive: "Aquí hay un ",
    after_negative: " menos de personas mayores de 65 años, que en el resto de España",
    before_positive: "Aquí hay un ",
    after_positive: " mas de personas mayores de 65 años, que en el resto de España"
  },
  "Tasa de Paro" : {
    before_positive: "La tasa de paro se encuentra a un ",
    after_negative: " por debajo de la media",
    before_positive: "La tasa de paro se encuentra a un ",
    after_positive: " por encima de la media"
  },
  "PIB per cápita" : {
    before_positive: "El PIB per cápita aquí es un ",
    after_negative: " mas bajo que la media nacional",
    before_positive: "El PIB per cápita aquí es un ",
    after_positive: " mas alto que la media nacional"
  },
  "Edad media" : {
    before_positive: "Su población es ",
    after_negative: " años mas jóven que la media nacional",
    before_positive: "Su población es ",
    after_positive: " años mas mayor que la media nacional"
  },
  "Inmigración" : {
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_negative: " por debajo de la media",
    before_positive: "El porcentaje de inmigración en este municipio está ",
    after_positive: " por encima de la media"
  },
  "Saldo vegetativo": {
    before_positive: "El crecimiento de la población está un ",
    after_negative: " por debajo de la media",
    before_positive: "El crecimiento de la población está un ",
    after_positive: " por encima de la media"
  },
  "Salario medio": {
    before_positive: "El salario medio aquí está un ",
    after_negative: " por debajo de la media",
    before_positive: "El salario medio aquí está un ",
    after_positive: " por encima de la media"
  },
  "Estudios acabados": {
    before_positive: "Un ",
    after_negative: " menos que la media nacional, tiene los estudios secundarios terminados",
    before_positive: "Un ",
    after_positive: " mas que la media nacional, tiene los estudios secundarios terminados"
  },
  "Penetracion internet": {
    before_positive: "Un ",
    after_negative: " menos que la media, tiene acceso a internet aquí",
    before_positive: "Un ",
    after_positive: " mas que la media, tiene acceso a internet aquí"
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

