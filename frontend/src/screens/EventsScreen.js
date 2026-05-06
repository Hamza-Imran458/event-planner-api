import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar as CalendarIcon, Plus, LogOut } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import GradientButton from '../components/GradientButton';

function sortEventsNewestFirst(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const idA = Number(a.id);
    const idB = Number(b.id);
    if (Number.isFinite(idA) && Number.isFinite(idB)) {
      return idB - idA;
    }
    const toTs = (e) => {
      const date = e.date || '1970-01-01';
      const time = e.time && String(e.time).length ? String(e.time) : '00:00';
      const iso = time.length === 5 ? `${date}T${time}:00` : `${date}T${time}`;
      const ts = new Date(iso).getTime();
      return Number.isFinite(ts) ? ts : 0;
    };
    return toTs(b) - toTs(a);
  });
}

export default function EventsScreen({ route, navigation }) {
  const initialToken = route?.params?.token || '';
  const initialUsername = route?.params?.username || '';

  const [token, setToken] = useState(initialToken);
  const [username, setUsername] = useState(initialUsername);
  const [events, setEvents] = useState([]);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalInitialValues, setModalInitialValues] = useState({ name: '', date: '', time: '', location: '', description: '' });

  // Sample data fallback if no events
  const fallbackEvents = [
    {
      id: 'mock1',
      name: 'Summer Music Festival',
      date: '2026-06-15',
      time: '18:00',
      location: 'Central Park, New York',
      description: 'Join us for an unforgettable evening of live music, food, and fun under the stars.'
    }
  ];

  const fetchEvents = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) return;

      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(sortEventsNewestFirst(data));
      }
    } catch (err) {
      console.log('Using fallback events due to network error');
      if (events.length === 0) setEvents(sortEventsNewestFirst(fallbackEvents));
    }
  }, []);

  useEffect(() => {
    async function bootstrapAuth() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedToken) setToken(storedToken);
      if (storedUsername) setUsername(storedUsername);
      fetchEvents();
    }
    bootstrapAuth();
  }, [fetchEvents]);

  async function handleSubmit(values, { resetForm }) {
    if (!token) {
      Alert.alert('Unauthorized', 'Please login first.');
      return;
    }

    if (isEditing) {
      try {
        console.log(`[FRONTEND] Updating event: ${editingId}`, values);
        const response = await fetch(`${API_BASE_URL}/events/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) {
          Alert.alert('Update failed', data.message || `HTTP ${response.status}`);
          return;
        }
        console.log(`[FRONTEND] Event updated successfully: ${editingId}`);
        resetForm();
        fetchEvents();
        closeModal();
      } catch (err) {
        Alert.alert('Error', 'Could not update event.');
      }
    } else {
      try {
        console.log('[FRONTEND] Creating new event:', values);
        const response = await fetch(`${API_BASE_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Create failed', data.message || `HTTP ${response.status}`);
          return;
        }
        console.log('[FRONTEND] Event created successfully:', data.id);
        resetForm();
        fetchEvents();
        closeModal();
      } catch (err) {
        Alert.alert('Error', 'Could not create event.');
      }
    }
  }

  async function deleteEvent(item) {
    if (!token) {
      Alert.alert('Unauthorized', 'Please login first.');
      return;
    }

    try {
      console.log(`[FRONTEND] Deleting event: ${item.id}`);
      const response = await fetch(`${API_BASE_URL}/events/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Delete failed', data.message || `HTTP ${response.status}`);
        return;
      }
      console.log(`[FRONTEND] Event deleted successfully: ${item.id}`);
      fetchEvents();
    } catch (err) {
      Alert.alert('Error', 'Could not delete event.');
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    setToken('');
    navigation.replace('Login');
  }

  function openCreateModal() {
    setModalInitialValues({ name: '', date: '', time: '', location: '', description: '' });
    setIsEditing(false);
    setEditingId(null);
    setModalVisible(true);
  }

  function openEditModal(item) {
    setModalInitialValues({
      name: item.name || '',
      date: item.date || '',
      time: item.time || '',
      location: item.location || '',
      description: item.description || '',
    });
    setEditingId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <CalendarIcon size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyHeading}>No events yet</Text>
      <Text style={styles.emptySub}>Create your first event to get started</Text>
      <GradientButton title="Create Event" onPress={openCreateModal} style={{ marginTop: 24 }} />
    </View>
  );

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your Events</Text>
            <Text style={styles.subtitle}>Welcome {username || 'User'} - manage your schedule</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <LogOut size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onEdit={() => openEditModal(item)}
              onDelete={() => {
                Alert.alert("Delete Event", "Are you sure?", [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(item) }
                ]);
              }}
            />
          )}
          ListEmptyComponent={renderEmptyState}
        />

        {events.length > 0 && (
          <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
            <LinearGradient
              colors={['#2563EB', '#0F172A']}
              style={styles.fabGradient}
            >
              <Plus size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        <CreateEventModal
          visible={modalVisible}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialValues={modalInitialValues}
          isEditing={isEditing}
        />

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.24)',
    backgroundColor: 'rgba(15,23,42,0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: 11,
    backgroundColor: 'rgba(148,163,184,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 52,
    paddingHorizontal: 16,
  },
  emptyHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  }
});
