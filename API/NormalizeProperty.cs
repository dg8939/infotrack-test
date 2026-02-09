namespace API
{
    public static class NormalizeProperty
    {
        public static InternalProperty PropertyMapping(ExternalProperty input)
        {
            if (input == null)
            {
                throw new ArgumentNullException("input");
            }

            // Formatting the address
            string fullAddress = "";

            if (!string.IsNullOrEmpty(input.formattedAddress))
            {
                fullAddress = input.formattedAddress;
            }
            else
            {
                var parts = input.addressParts;
                if (parts != null)
                {
                    if (!string.IsNullOrEmpty(parts.street) || !string.IsNullOrEmpty(parts.suburb) || !string.IsNullOrEmpty(parts.state) || !string.IsNullOrEmpty(parts.postcode))
                    {
                        fullAddress = $"{parts.street}, {parts.suburb} {parts.state} {parts.postcode}".Trim();
                    }
                }
            }

            var output = new InternalProperty
            {
                fullAddress = fullAddress,
                lotPlan = new InternalPropertyLotPlan
                {
                    lot = input.lotPlan.lot,
                    plan = input.lotPlan.plan
                },

                // Faced some error in this output being empty string ("") instead of null

                volumeFolio = new VolumeFolio
                {
                    volume = input.title.volume == "" ? null : input.title.volume,
                    folio = input.title.folio == "" ? null : input.title.folio

                },

                sourceTrace = new SourceTrace
                {
                    provider = input.provider,
                    requestId = input.requestId,
                    receivedAt = input.receivedAt
                }
            };

            if (input.title.volume == "" || input.title.folio == "")
            {
                output.status = "UnknownVolFol";
            }

            else
            {
                output.status = "KnownVolFol";
            }

            return output;
        }
    }
}