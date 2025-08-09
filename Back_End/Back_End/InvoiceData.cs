using System.Runtime.Serialization;

[DataContract]
public class InvoiceData
{
    [DataMember]
    public int CustomerId { get; set; }

    [DataMember]
    public string HTML { get; set; }

    [DataMember]
    public decimal TotalAmount { get; set; }
}
