//Start the conversion. Note that this is only necessary
//when HtmlToPdf.Options.TriggerMode is set Manual or Dual.
//The default value is Auto, so the conversion starts 
//automatically.
//You may also use variable "eoapi" to check whether the page
//is running inside the converter so that the custom triggering
//code will not run inside a regular browser because variable
//"eoapi" does not exist in a regular browser

function jsIsEOPdf() {
  return (window.eoapi && eoapi.isEOPdf() ? true : false);
}

function jsStartEOPdfConvert() {

  if (window.eoapi && eoapi.isEOPdf()) {
    console.log("eoapi.convert called !");
    eoapi.convert();
    return true;
  }
  return false;
}



// --------------------------------------------------------
function chkWindowEOApi() {
  return (window.eoapi ? true : false);
}

function chkTypeOfEOApi() {
  return typeof eoapi;
}

function chkIsDefinedEOApi() {
  return !(typeof eoapi == "undefined");
}

function exist_isEOPdf() {

  if (chkIsDefinedEOApi()) {
    if (typeof eoapi.isEOPdf === 'function') {
      return "It's a function (" + eoapi.isEOPdf() + ")";
    } else if (typeof eoapi.isEOPdf === 'undefined') {
      return "It's undefined";
    } else {
      return "It's neither undefined nor a function. It's a « " + typeof eoapi.isEOPdf + " »";
    }
  }

  return "eoapi is undefined";
}

function exist_convert() {

  if (chkIsDefinedEOApi()) {
    if (typeof eoapi.convert === 'function') {
      return "It's a function";
    } else if (typeof eoapi.convert === 'undefined') {
      return "It's undefined";
    } else {
      return "It's neither undefined nor a function. It's a « " + typeof eoapi.convert + " »";
    }
  }

  return "eoapi is undefined";
}


