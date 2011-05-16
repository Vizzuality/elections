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
    content: "Desviación respecto a la media del porcentaje de personas mayores de 65 años",
    left: "mas mayores",
    right: "mas jóvenes",
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
    right: "mas inmigrantes",
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
    left: "sueldos mas bajos",
    right: "sueldos mas altos",
    legendTop: "Sueldos mas altos",
    legendBottom:"Sueldos mas bajos"
  },
  "Estudios acabados" : {
    content: "Desviación respecto a la media del porcentaje de personas con estudios acabados",
    left: "menos habitantes",
    right: "mas habitantes",
    legendTop: "Mas habitantes",
    legendBottom:"Menos habitantes"
  },
  "Penetración internet" : {
    content: "Desviación respecto a la media del porcentaje de personas acceso a internet",
    left: "menos habitantes",
    right: "mas habitantes",
    legendTop: "Mas habitantes",
    legendBottom:"Menos habitantes"
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
