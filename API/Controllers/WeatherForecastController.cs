using API.Contract;
using API.Classes;
using EO.Pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class WeatherForecastController : ControllerBase
    {
        private readonly string[] Summaries = new[]
        {
            "Freezing",  "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        /// <summary> The application environment. </summary>
        private readonly IWebHostEnvironment environment;

        /// <summary> The configuration. </summary>
        private readonly IConfiguration configuration;

        public WeatherForecastController(
            IWebHostEnvironment environment,
            IConfiguration configuration,
            ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
            this.configuration = configuration;
            this.environment = environment;
        }

        /// <summary>
        /// Called from a link in an email (thus an http get) to change the registration status of a DATI.
        /// </summary>
        /// <param name="a">Token for Action on DATI.</param>
        /// https://localhost:44310/weatherforecast/GetData
        /// <returns>IActionResult.</returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetData()
        {
            var rng = new Random();
            List<WeatherForecast> listWF = new List<WeatherForecast>();

            for (int i = 0; i < 5; i++)
            {
                listWF.Add(new WeatherForecast
                {
                    // Date = DateTime.Now.AddDays(i),
                    TemperatureC = rng.Next(-20, 55),
                    Summary = Summaries[rng.Next(Summaries.Length)]
                });
            }

            return this.Ok(listWF);
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult CreateReportPDF([FromBody] DownloadReportContract model)
        {
            string url = this.configuration["ClientDomain"];

            // ----------------------------------------------------------------------
            //if (environment.IsDevelopment())
            //{
            //    url = "http://localhost:4200";
            //}
            //else
            //{
            //    url = "https://dev.safeprotect.fr";
            //}

            // ----------------------------------------------------------------------
            // url = http://localhost:4200/rendering?... (if it is in localhost mode)
            //HttpRequest request = this.httpContextAccessor.HttpContext.Request;
            //if (request.Host.HasValue)
            //{
            //    string host = request.Host.Host;
            //    if (host.Equals("localhost", StringComparison.CurrentCulture))
            //    {
            //        url = "http://localhost:4200";
            //    }
            //}

            // ----------------------------------------------------------------------
            // url = http://localhost:4200/rendering?... (if it is in localhost mode)
            url = string.Format("{0}/rendering?model={1}&category={2}", url, model.ModelId, model.CategoryId);
            string localFilePath = @"C:\Temp\SamplePDF\sample.pdf";

            try
            {
                byte[] bytesFilePdf = null;

                string pdHeader = string.Format("Report - Model: {0} - Category: {1}", model.ModelId, model.CategoryId);
                string htmlPdfHeader = $@"<div style='text-align:center; border: 0px solid red'>{pdHeader}</div>";
                string footerPdf_datetime = string.Format("Printed: {0}", DateTime.Now.ToString("dd/MM/yyyy HH:mm"));

                System.Text.StringBuilder footerPdf = new System.Text.StringBuilder();
                footerPdf.Append(@"<div style='text-align:center; border: 0px solid red'>");
                footerPdf.Append(@"    <table width='100%' border='0' cellpadding='0'>");
                footerPdf.Append(@"    <tr>");
                footerPdf.Append($@"       <td width='33%'>{footerPdf_datetime}</td>");
                footerPdf.Append(@"       <td width='33%' align='center'>Page: {page_number} of {total_pages}</td>");
                footerPdf.Append(@"       <td align='right'>User Name</td>");
                footerPdf.Append(@"    </tr>");
                footerPdf.Append(@"    </table>");
                footerPdf.Append(@"</div>");

                // -------------------------------------------------------------
                HtmlToPdfOptions options = new HtmlToPdfOptions()
                {
                    // TriggerMode = HtmlToPdfTriggerMode.Manual, // Operation timed out why "eoapi" is not defined !
                    TriggerMode = HtmlToPdfTriggerMode.Manual,
                    HeaderHtmlFormat = htmlPdfHeader,
                    FooterHtmlFormat = footerPdf.ToString(),
                    MinLoadWaitTime = 3 * 1000,  // 3 seconds
                    MaxLoadWaitTime = 30 * 1000, // 10 seconds (Timeout)
                    UsePrintMedia = true,

                    // OutputArea = new System.Drawing.RectangleF(0.2f, 0.1f, 11.2f, 1f) // Set PDF page margins
                    // PageSize = EO.Pdf.PdfPageSizes.A4,

                    //Using A4 in landscape, note that the width/height values are swapped        
                    // PageSize = new SizeF(EO.Pdf.PdfPageSizes.A4.Height, EO.Pdf.PdfPageSizes.A4.Width)

                    //Set margins to 0.5 inch on all sides
                    OutputArea = new RectangleF(0.5f, 0.5f, 7.5f, 10f),
                    AfterRenderPage = new EO.Pdf.PdfPageEventHandler(On_AfterRenderPage)
                };

                // -------------------------------------------------------------
                PdfDocument doc = new PdfDocument();
                HtmlToPdf.ConvertUrl(url, doc, options);

                // -------------------------------------------------------------
                // Hide the HTML header in the first page, it doesn't work !
                //string hideHeader = @"<div style='background-color:#fff; height:27px; width:200px; text-align:center; border: 1px solid red'></div>";
                //HtmlToPdf.ConvertHtml(hideHeader, doc.Pages[0]);

                if (model.Action == 0) // 0 => Create
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        doc.Save(ms);
                        bytesFilePdf = ms.ToArray();

                        using (FileStream file = new FileStream(localFilePath, FileMode.Create, System.IO.FileAccess.Write))
                        {
                            ms.Read(bytesFilePdf, 0, (int)ms.Length);
                            file.Write(bytesFilePdf, 0, bytesFilePdf.Length);
                        }
                    }
                    HtmlToPdf.ClearResult();

                    return this.Ok();
                }
                else if (model.Action == 1) // 1 => Download
                {

                    // -------------------------------------------------------------
                    // Save to memory stream
                    using (MemoryStream ms = new MemoryStream())
                    {
                        doc.Save(ms);
                        bytesFilePdf = ms.ToArray();
                    }

                    // HtmlToPdf.ClearResult();
                    // -------------------------------------------------------------
                    // return the PDF file
                    return this.File(bytesFilePdf, "application/pdf", "test.pdf");
                }

                return this.BadRequest("INVALID_OPERATION");
            }
            catch (Exception ex)
            {
                // Conversion failed. Operation timed out while waiting manual trigger to be called.
                return this.BadRequest(new SerializeException(ex));
            }

        }


        //This function is called after every page is created
        private void On_AfterRenderPage(object sender, EO.Pdf.PdfPageEventArgs e)
        {
            /*
            //Set the output area to the top portion of the page. Note
            //this does not change the output area of the original
            //conversion from which we are called
            EO.Pdf.HtmlToPdf.Options.OutputArea = new RectangleF(0, 0, 8.5f, 1f);

            //Render an image and a horizontal line. Note the
            //second argument is the PdfPage object
            //EO.Pdf.HtmlToPdf.ConvertHtml(@"<span>http://www.essentialobjects.com/images/logo.gif</span><br />", e.Page);
            */

            if (e.Page.Index == 0)
            {
                // -------------------------------------------------------------
                // Hide the HTML header in the first page, it doesn't work !
                // EO.Pdf.HtmlToPdf.Options.OutputArea = new RectangleF(0, 0, 8.5f, 1f);
                HtmlToPdf.Options.OutputArea = new System.Drawing.RectangleF(0.2f, 0.1f, 11.2f, 1f);
                // string hideHeader = @"<div style='background-color:#fff; height:27px; width:100%; text-align:center; border: 1px solid red'></div>";
                string hideHeader = "<div style='background-color:#fff; height:27px; text-align:center; border: 0px solid red'></div>";
                HtmlToPdf.ConvertHtml(hideHeader, e.Page);
            }
        }
    }
}
