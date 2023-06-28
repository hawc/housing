export function SettlementMap(lat: number, lng: number) {
  return <>
    <iframe
      width="600"
      height="450"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCRD4mqrbmf0ah6tGx-dGmjX02mztam738&q=${lat},${lng}`}>
    </iframe>
  </>
}