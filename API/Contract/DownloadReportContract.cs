﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Contract
{
    public class DownloadReportContract
    {
        public int CategoryId { get; set; }
        public int ModelId { get; set; }
        public int Action { get; set; } // 0 => Create; 1 => Download
    }
}
