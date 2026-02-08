namespace API
{

    public class ExternalProperty
    {
        public string? provider { get; set; }
        public string? requestId { get; set; }
        public string receivedAt { get; set; }
        public string? formattedAddress { get; set; }
        public AdddressParts? addressParts { get; set; }
        public LotPlan? lotPlan { get; set; }
        public Title? title { get; set; }
        public Extra? extra { get; set; }
    }

    public class AdddressParts
    {
        public string street { get; set; }
        public string suburb { get; set; }
        public string state { get; set; }
        public string postcode { get; set; }
    }

    public class LotPlan
    {
        public string lot { get; set; }
        public string plan { get; set; }

    }

    public class Title
    {
        // ? can make the variable null
        public string? volume { get; set; }
        public string? folio { get; set; }
    }

    public class Extra
    {
        public double confidence { get; set; }
    }
}