using System;

namespace API.Classes
{
    [Serializable]
    public class SerializeException
    {
        public DateTime TimeStamp { get; set; }
        public string Message { get; set; }
        public string StackTrace { get; set; }

        public SerializeException()
        {
            this.TimeStamp = DateTime.Now;
        }

        public SerializeException(string Message) : this()
        {
            this.Message = Message;
        }

        public SerializeException(System.Exception ex) : this(ex.Message)
        {
            this.StackTrace = ex.StackTrace;
        }

        public override string ToString()
        {
            return this.Message + this.StackTrace;
        }
    }
}
