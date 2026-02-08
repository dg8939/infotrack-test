using System;
using API;
using Xunit;

namespace Api.Tests
{
    public class NormalizePropertyTests
    {
        // Helper: create an ExternalProperty in the shape YOUR code expects.
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

        [Fact]
        public void PropertyMapping_ThrowsArgumentNull_WhenInputIsNull()
        {
            // Arrange
            ExternalProperty? input = null;

            // Act & Assert
            Assert.Throws<ArgumentNullException>(
                () => NormalizeProperty.PropertyMapping(input!)
            );
        }

        [Fact]
        public void PropertyMapping_MapsFullAddress_FromFormattedAddress()
        {
            // Arrange
            var external = CreateExternal(
                formattedAddress: "10 Example St, Carlton VIC 3053"
            );

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.Equal("10 Example St, Carlton VIC 3053", result.fullAddress);
        }

        [Fact]
        public void PropertyMapping_MapsLotPlan_Directly()
        {
            // Arrange
            var external = CreateExternal(lot: "12", plan: "PS123456");

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.NotNull(result.lotPlan);
            Assert.Equal("12", result.lotPlan.lot);
            Assert.Equal("PS123456", result.lotPlan.plan);
        }

        [Fact]
        public void PropertyMapping_MapsVolumeFolio_WhenNonEmpty()
        {
            // Arrange: volume and folio are non-empty strings.
            var external = CreateExternal(volume: "1234", folio: "567");

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.NotNull(result.volumeFolio);
            Assert.Equal("1234", result.volumeFolio.volume);
            Assert.Equal("567", result.volumeFolio.folio);

            // Because both are non-empty, your current code sets status = "KnownVolFol"
            Assert.Equal("KnownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_NullsVolumeAndFolio_WhenEmptyStrings()
        {
            // Arrange: volume and folio are empty strings ("")
            var external = CreateExternal(volume: "", folio: "");

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert: your code converts "" to null in volumeFolio.
            Assert.Null(result.volumeFolio.volume);
            Assert.Null(result.volumeFolio.folio);

            // And with your current implementation, status becomes "UnkownVolFol" (typo kept).
            Assert.Equal("UnkownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_SetsUnkownVolFol_WhenOnlyVolumeEmpty()
        {
            // Arrange: volume = "", folio = "567"
            var external = CreateExternal(volume: "", folio: "567");

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.Null(result.volumeFolio.volume);
            Assert.Equal("567", result.volumeFolio.folio);
            Assert.Equal("UnkownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_SetsUnkownVolFol_WhenOnlyFolioEmpty()
        {
            // Arrange: volume = "1234", folio = ""
            var external = CreateExternal(volume: "1234", folio: "");

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.Equal("1234", result.volumeFolio.volume);
            Assert.Null(result.volumeFolio.folio);
            Assert.Equal("UnkownVolFol", result.status);
        }

        [Fact]
        public void PropertyMapping_MapsSourceTrace_Directly()
        {
            // Arrange
            var external = CreateExternal(
                provider: "VIC-DDP",
                requestId: "REQ-12345",
                receivedAt: "2025-08-30T03:12:45Z"
            );

            // Act
            InternalProperty result = NormalizeProperty.PropertyMapping(external);

            // Assert
            Assert.Equal("VIC-DDP", result.sourceTrace.provider);
            Assert.Equal("REQ-12345", result.sourceTrace.requestId);
            Assert.Equal("2025-08-30T03:12:45Z", result.sourceTrace.receivedAt);
        }
    }
}
