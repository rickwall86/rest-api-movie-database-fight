const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  // Insert HTML for autocomplete dropdown
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  // DOM selectors
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  // Functionality for the search input
  const onInput = async (e) => {
    const items = await fetchData(e.target.value);

    if (items === undefined) {
      dropdown.classList.remove("is-active");
      return;
    }

    // Clear contents of dropdown (from any previous searches)
    resultsWrapper.innerHTML = "";
    // Display dropdown
    dropdown.classList.add("is-active");

    for (let item of items) {
      const option = document.createElement("a");
      // Add new dropdown item
      option.classList.add("dropdown-item");
      // Inject HTML content
      option.innerHTML = renderOption(item);

      // Click event for when item title is clicked within the dropdown
      option.addEventListener("click", () => {
        // Close the dropdown
        dropdown.classList.remove("is-active");
        // Update the value of the input with clicked option from dropdown
        input.value = inputValue(item);
        // Get data from API
        onOptionSelect(item);
      });
      // Add anchor tags into HTML
      resultsWrapper.appendChild(option);
    }
  };

  // input event on input field with debounce
  input.addEventListener("input", debounce(onInput, 500));

  // Listens for a click anywhere on the page. All children elements 'bubble' up until the event is found
  document.addEventListener("click", (e) => {
    // Check if root contains any child elements from the click event. If it doesnt, then close the dropdown
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
