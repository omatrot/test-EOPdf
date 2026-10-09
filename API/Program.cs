using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Register the code page provider to support additional encodings
            // EO.Pdf 21 essaie d’utiliser la page de code 437, mais .NET 7 ne charge pas ces encodages legacy par défaut.
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            EO.WebBrowser.WebView.ShowDebugUI();
            CreateHostBuilder(args).Build().Run();
        }
            
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
