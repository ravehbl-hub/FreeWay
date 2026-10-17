// AdminUsers: list of users, the admin can change roles or delete users
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { changeUserRole, deleteUser, fetchUsers } from '../../api/users.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const { data, loading, error, reload } = useFetch(fetchUsers);
  const [actionError, setActionError] = useState('');

  async function handleRole(id, role) {
    setActionError('');
    try {
      await changeUserRole(id, role);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete(person) {
    if (!window.confirm(t('admin.deleteUser').replace('{name}', person.name))) return;
    setActionError('');
    try {
      await deleteUser(person.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading && !data) return <Loader text="loading.users" />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div>
      <ErrorMessage message={actionError} />
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.bookings')}</th>
              <th>{t('admin.role')}</th>
              <th aria-label={t('common.actions')} />
            </tr>
          </thead>
          <tbody>
            {data.users.map((person) => {
              const isMe = person.id === currentUser.id;
              return (
                <tr key={person.id}>
                  <td>{person.name}{isMe ? ' ' + t('common.you') : ''}</td>
                  <td>{person.email}</td>
                  <td>{person.bookings_count}</td>
                  <td>
                    <select value={person.role} disabled={isMe} onChange={(event) => handleRole(person.id, event.target.value)} aria-label={t('admin.role')}>
                      <option value="user">{t('admin.roleUser')}</option>
                      <option value="admin">{t('admin.roleAdmin')}</option>
                    </select>
                  </td>
                  <td className="table-actions">
                    {!isMe && (
                      <button type="button" className="icon-link danger" aria-label={t('admin.deleteUserLabel')} onClick={() => handleDelete(person)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
