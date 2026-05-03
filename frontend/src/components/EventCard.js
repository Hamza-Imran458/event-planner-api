import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Edit3, Trash2 } from 'lucide-react-native';
import GlassCard from './GlassCard';

export default function EventCard({ item, onEdit, onDelete }) {
  return (
    <GlassCard style={styles.cardContainer} intensity={35} contentStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconButton}>
              <Edit3 size={16} color="#CBD5E1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item)} style={styles.iconButton}>
              <Trash2 size={16} color="#F87171" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={14} color="#94A3B8" />
          <Text style={styles.infoText}>{item.date} {item.time && `• ${item.time}`}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={14} color="#94A3B8" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 14,
    borderRadius: 18,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(15,23,42,0.55)',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148,163,184,0.14)',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: '#CBD5E1',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 19,
  },
});
