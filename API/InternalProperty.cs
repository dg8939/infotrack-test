namespace API
{
    public class InternalProperty
    {
        public string fullAddress { get; set; }
        public InternalPropertyLotPlan lotPlan { get; set; }
        public VolumeFolio volumeFolio { get; set; }
        public string status { get; set; }
        public SourceTrace sourceTrace { get; set; }
    }

    public class InternalPropertyLotPlan
    {
        public string lot { get; set; }
        public string plan { get; set; }
    }

    public class SourceTrace
    {
        public string provider { get; set; }
        public string requestId { get; set; }
        public string receivedAt { get; set; }
    }

    public class VolumeFolio
    {
        public string? volume { get; set; }
        public string? folio { get; set; }
    }
}