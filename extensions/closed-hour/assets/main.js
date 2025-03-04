/**
 * Checks if a store is closed based on the current time and an array of closed periods.
 * A closed period is an object with initialHour and finalHour properties, with the times represented as strings in the format "HH:MM".
 * The function takes into account periods that cross midnight.
 *
 * @param {ClosedHourCommand[]} closedHours - An array of closed periods.
 * @param {string} currentTime - The current time as a string in the format "HH:MM".
 * @returns {boolean} - True if the store is closed, false otherwise.
 */
function checkStoreStatus(
  closedHours,
  currentTime,
) {
  function getTimeInMinutes(timeString) {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  const currentMinutes = getTimeInMinutes(currentTime);

  let isClosed = false;

  for (let period of closedHours) {
    const initialTime = getTimeInMinutes(period.initialHour);
    const finalTime = getTimeInMinutes(period.finalHour);

    if (currentMinutes >= initialTime && currentMinutes <= finalTime) {
      isClosed = true;
      break;
    }

    if (initialTime > finalTime) {
      if (currentMinutes >= initialTime || currentMinutes <= finalTime) {
        isClosed = true;
        break;
      }
    }
  }

  return isClosed;
}
(
  function () {

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    fetch("https://innocent-harry-occurrence-them.trycloudflare.com/app/api/closedHour" + `?timezone=${timezone}`)
      .then(response => response.json())
      .then(response => {
        const now = new Date();

        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}`

        const isClosed = checkStoreStatus(response.closedHours, currentTime)


        if (!isClosed) {

          //PDP page
          const formButtons = document.querySelector(".product-form__buttons");

          if (formButtons) {
            formButtons.style.display = "none";
          }


          // Create the button element
          const button = document.createElement("button");
          button.textContent = "Store is Closed";
          button.disabled = true;

          // Style the button if needed (optional)
          button.style.padding = "10px 20px";
          button.style.backgroundColor = "#ff4d4d"; // Red background color
          button.style.color = "white";
          button.style.border = "none";
          button.style.borderRadius = "5px";
          button.style.cursor = "not-allowed";

          // Find the div.product-form and insert the button inside it
          const productForm = document.querySelector("product-form");
          if (productForm) {
            productForm.appendChild(button);
          } else {
            console.error("div.product-form not found");
          }



          //Cart page
          const checkoutButton = document.querySelector("button#checkout");
          if (checkoutButton) {
            checkoutButton.style.display = "none";
          }

          const checkoutDiv = document.querySelector(".cart__ctas");

          if (checkoutDiv) {
            checkoutDiv.appendChild(button);
          }
        }



      })
      .catch(err => {
        console.error(err)
      })

  }
)()
