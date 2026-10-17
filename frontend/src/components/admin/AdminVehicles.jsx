// AdminVehicles: table of all vehicles with add / edit / delete
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { createVehicle, deleteVehicle, fetchVehicles, updateVehicle } from '../../api/vehicles.api.js';
import { capitalize, formatPrice } from '../../utils/format.js';
import VehicleForm from './VehicleForm.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function AdminVehicles() {
  const { data, loading, error, reload } = useFetch(() => fetchVehicles());
  const [editing, setEditing] = useState(null); // null = closed, 'new' = add form, object = edit form
  const [actionError, setActionError] = useState('');

  async function handleSave(values) {
    if (editing === 'new') {
      await createVehicle(values);
    } else {
      await updateVehicle(editing.id, values);
    }
    setEditing(null);
    reload();
  }

  async function handleDelete(vehicle) {
    if (!window.confirm('Delete ' + vehicle.name + '? Its bookings will also be deleted.')) return;
    setActionError('');
    try {
      await deleteVehicle(vehicle.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading && !data) return <Loader text="Loading vehicles..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div>
      {editing ? (
        <VehicleForm vehicle={editing === 'new' ? null : editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />
      ) : (
        <button type="button" className="button button-green" onClick={() => setEditing('new')}>
          <Plus size={16} /> Add vehicle
        </button>
      )}
      <ErrorMessage message={actionError} />
      {data.vehicles.length === 0 ? (
        <EmptyState title="No vehicles" text="Add the first vehicle to the fleet." />
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {data.vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.name}</td>
                  <td>{capitalize(vehicle.category)}</td>
                  <td>{vehicle.seats}</td>
                  <td>{formatPrice(vehicle.price_per_day)}</td>
                  <td>{vehicle.available ? 'Available' : 'Hidden'}</td>
                  <td className="table-actions">
                    <button type="button" className="icon-link" aria-label="Edit" onClick={() => setEditing(vehicle)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-link danger" aria-label="Delete" onClick={() => handleDelete(vehicle)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
