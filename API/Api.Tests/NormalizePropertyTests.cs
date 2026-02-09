using System;
using API;
using Xunit;

namespace Api.Tests
{
    public class NormalizePropertyTests
    {
        // External property object
        private ExternalProperty CreateExternal(
            string? formattedAddress = "10 Example St, Carlton VIC 3053",
            string? provider = "VIC-DDP",
            string? requestId = "REQ-12345",
            string receivedAt = "2025-08-30T03:12:45Z",
            string? lot = "12",
            string? plan = "PS123456",
            string? volume = "1234",
            string? folio = "567"
        )
        {
            return new ExternalProperty
            {
                provider = provider,
                requestId = requestId,
                receivedAt = receivedAt,
                formattedAddress = formattedAddress,
                addressParts = new AdddressParts
                {
                    street = "10 Example St",
                    suburb = "Carlton",
                    state = "VIC",
                    postcode = "3053"
                },
                lotPlan = new LotPlan
                {
                    lot = lot!,
                    plan = plan!
                },
                title = new Title
                {
                    volume = volume,
                    folio = folio
                },
                extra = new Extra
                {
                    confidence = 0.98
                }
            };
        }

        // Fact: test case
        [Fact]
        public void PropertyMapping_ThrowsArgumentNull_WhenInputIsNull()
        {
            ExternalProperty? input = null;

            Assert.Throws<ArgumentNullException>(
                () => NormalizeProperty.PropertyMapping(input!)
            );
        }

        [Fact]
        public void PropertyMapping_MapsFullAddress_FromFormattedAddress()
        {
            var external = CreateExternal(
                formattedAddress: "10 Example St, Carlton VIC 3053"
            );

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.Equal("10 Example St, Carlton VIC 3053", result.fullAddress);
        }

        [Fact]
        public void PropertyMapping_MapsLotPlan_Directly()
        {
            var external = CreateExternal(lot: "12", plan: "PS123456");

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.NotNull(result.lotPlan);
            Assert.Equal("12", result.lotPlan.lot);
            Assert.Equal("PS123456", result.lotPlan.plan);
        }

        [Fact]
        public void PropertyMapping_MapsVolumeFolio_WhenNonEmpty()
        {
            var external = CreateExternal(volume: "1234", folio: "567");

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.NotNull(result.volumeFolio);
            Assert.Equal("1234", result.volumeFolio.volume);
            Assert.Equal("567", result.volumeFolio.folio);

            Assert.Equal("KnownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_NullsVolumeAndFolio_WhenEmptyStrings()
        {
            var external = CreateExternal(volume: "", folio: "");

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.Null(result.volumeFolio.volume);
            Assert.Null(result.volumeFolio.folio);

            Assert.Equal("UnknownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_SetsUnkownVolFol_WhenOnlyVolumeEmpty()
        {
            var external = CreateExternal(volume: "", folio: "567");

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.Null(result.volumeFolio.volume);
            Assert.Equal("567", result.volumeFolio.folio);
            Assert.Equal("UnknownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_SetsUnkownVolFol_WhenOnlyFolioEmpty()
        {
            var external = CreateExternal(volume: "1234", folio: "");

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.Equal("1234", result.volumeFolio.volume);
            Assert.Null(result.volumeFolio.folio);
            Assert.Equal("UnknownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_MapsSourceTrace_Directly()
        {
            var external = CreateExternal(
                provider: "VIC-DDP",
                requestId: "REQ-12345",
                receivedAt: "2025-08-30T03:12:45Z"
            );

            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            Assert.Equal("VIC-DDP", result.sourceTrace.provider);
            Assert.Equal("REQ-12345", result.sourceTrace.requestId);
            Assert.Equal("2025-08-30T03:12:45Z", result.sourceTrace.receivedAt);
        }
    }
}
