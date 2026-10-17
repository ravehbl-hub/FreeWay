// VehicleFilters: search box + category / transmission / seats / max price filters
export default function VehicleFilters({ filters, onChange, onReset }) {
  function handleChange(event) {
    onChange({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="card filters">
      <input name="search" placeholder="Search a model..." value={filters.search} onChange={handleChange} aria-label="Search" />
      <select name="category" value={filters.category} onChange={handleChange} aria-label="Category">
        <option value="">All categories</option>
        <option value="compact">Compact</option>
        <option value="suv">SUV</option>
        <option value="premium">Premium</option>
      </select>
      <select name="transmission" value={filters.transmission} onChange={handleChange} aria-label="Transmission">
        <option value="">Any transmission</option>
        <option value="auto">Automatic</option>
        <option value="manual">Manual</option>
      </select>
      <select name="minSeats" value={filters.minSeats} onChange={handleChange} aria-label="Seats">
        <option value="">Any seats</option>
        <option value="4">4+ seats</option>
        <option value="5">5+ seats</option>
        <option value="7">7+ seats</option>
      </select>
      <select name="maxPrice" value={filters.maxPrice} onChange={handleChange} aria-label="Max price">
        <option value="">Any price</option>
        <option value="50">Up to 50 € / day</option>
        <option value="80">Up to 80 € / day</option>
        <option value="120">Up to 120 € / day</option>
      </select>
      <button type="button" className="button button-light" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
