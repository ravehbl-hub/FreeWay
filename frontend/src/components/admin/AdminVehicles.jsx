// AdminVehicles: table of all vehicles with add / edit / delete
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { createVehicle, deleteVehicle, fetchVehicles, updateVehicle } from '../../api/vehicles.api.js';
import { formatPrice } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import VehicleForm from './VehicleForm.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function AdminVehicles() {
  const { t } = useLanguage();
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
    if (!window.confirm(t('admin.deleteVehicle').replace('{name}', vehicle.name))) return;
    setActionError('');
    try {
      await deleteVehicle(vehicle.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading && !data) return <Loader text="loading.vehicles" />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div>
      {editing ? (
        <VehicleForm vehicle={editing === 'new' ? null : editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />
      ) : (
        <button type="button" className="button button-green" onClick={() => setEditing('new')}>
          <Plus size={16} /> {t('admin.addVehicle')}
        </button>
      )}
      <ErrorMessage message={actionError} />
      {data.vehicles.length === 0 ? (
        <EmptyState title={t('admin.noVehicles')} text={t('admin.noVehiclesText')} />
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>{t('admin.name')}</th>
                <th>{t('admin.category')}</th>
                <th>{t('admin.seats')}</th>
                <th>{t('admin.price')}</th>
                <th>{t('common.status')}</th>
                <th aria-label={t('common.actions')} />
              </tr>
            </thead>
            <tbody>
              {data.vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.name}</td>
                  <td>{t('category.' + vehicle.category)}</td>
                  <td>{vehicle.seats}</td>
                  <td>{formatPrice(vehicle.price_per_day)}</td>
                  <td>{vehicle.available ? t('common.available') : t('common.hidden')}</td>
                  <td className="table-actions">
                    <button type="button" className="icon-link" aria-label={t('common.edit')} onClick={() => setEditing(vehicle)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-link danger" aria-label={t('common.delete')} onClick={() => handleDelete(vehicle)}>
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
