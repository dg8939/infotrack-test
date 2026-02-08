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

            var output = new InternalProperty
            {
                fullAddress = input.formattedAddress,
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
                output.status = "UnkownVolFol";
            }

            else
            {
                output.status = "KnownVolFol";
            }

            return output;
        }
    }
}