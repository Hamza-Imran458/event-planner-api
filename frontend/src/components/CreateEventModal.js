import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, FileText, Calendar, Clock, MapPin } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import GlassCard from './GlassCard';
import Input from './Input';
import GradientButton from './GradientButton';

const eventSchema = Yup.object().shape({
  name: Yup.string().trim().required('Event name is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  location: Yup.string().trim().required('Location is required'),
  description: Yup.string().trim().required('Description is required'),
});

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatTime(d) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function parseToDate(dateStr, timeStr) {
  const now = new Date();
  if (!dateStr || typeof dateStr !== 'string') return now;
  const parts = dateStr.split('-').map((p) => parseInt(p, 10));
  const [y, m, day] = parts;
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(day)) return now;
  let h = 12, min = 0;
  if (timeStr && /^\d{1,2}:\d{2}$/.test(String(timeStr))) {
    const [hh, mm] = String(timeStr).split(':').map((x) => parseInt(x, 10));
    if (Number.isFinite(hh)) h = hh;
    if (Number.isFinite(mm)) min = mm;
  }
  return new Date(y, m - 1, day, h, min, 0, 0);
}

export default function CreateEventModal({ visible, onClose, onSubmit, initialValues, isEditing }) {
  const [pickerMode, setPickerMode] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const formikRef = useRef(null);

  // When the modal is hidden, reset picker state
  useEffect(() => {
    if (!visible) {
      setPickerMode(null);
    }
  }, [visible]);

  // When modal opens with new initialValues, reset formik
  useEffect(() => {
    if (visible && formikRef.current) {
      formikRef.current.resetForm({ values: initialValues });
    }
  }, [visible, initialValues]);

  const openDatePicker = useCallback((dateVal, timeVal) => {
    setTempDate(parseToDate(dateVal, timeVal));
    setPickerMode('date');
  }, []);

  const openTimePicker = useCallback((dateVal, timeVal) => {
    setTempDate(parseToDate(dateVal || formatDate(new Date()), timeVal));
    setPickerMode('time');
  }, []);

  const closePicker = useCallback(() => setPickerMode(null), []);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
        <SafeAreaView style={styles.safeArea}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={eventSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, touched }) => {

              const onPickerChange = (event, selectedDate) => {
                if (Platform.OS === 'android') {
                  if (event?.type === 'dismissed') { setPickerMode(null); return; }
                  if (selectedDate) {
                    if (pickerMode === 'date') {
                      setFieldValue('date', formatDate(selectedDate));
                      setFieldTouched('date', true);
                    } else if (pickerMode === 'time') {
                      setFieldValue('time', formatTime(selectedDate));
                      setFieldTouched('time', true);
                    }
                  }
                  setPickerMode(null);
                  return;
                }
                if (selectedDate) setTempDate(selectedDate);
              };

              const commitIOSPicker = () => {
                if (pickerMode === 'date') {
                  setFieldValue('date', formatDate(tempDate));
                  setFieldTouched('date', true);
                } else if (pickerMode === 'time') {
                  setFieldValue('time', formatTime(tempDate));
                  setFieldTouched('time', true);
                }
                setPickerMode(null);
              };

              return (
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                  <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <X size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <GlassCard style={styles.modalCard} contentStyle={styles.modalContent}>
                    <Text style={styles.title}>{isEditing ? 'Edit Event' : 'Create Event'}</Text>
                    <Text style={styles.subtitle}>Enter details clearly and save changes</Text>

                    {/* Name */}
                    <View style={styles.inputGroup}>
                      <Input
                        icon={FileText}
                        placeholder="Event Name"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        error={errors.name}
                        touched={touched.name}
                      />
                    </View>

                    {/* Date */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Date</Text>
                      <Pressable
                        onPress={() => openDatePicker(values.date, values.time)}
                        style={({ pressed }) => [
                          styles.pickerField,
                          pressed && styles.pickerFieldPressed,
                          touched.date && errors.date && styles.pickerFieldError,
                        ]}
                      >
                        <Calendar size={18} color={touched.date && errors.date ? '#F87171' : '#94A3B8'} style={styles.pickerIcon} />
                        <Text style={[styles.pickerValue, !values.date && styles.pickerPlaceholder]}>
                          {values.date || 'Select date'}
                        </Text>
                      </Pressable>
                      {touched.date && errors.date && (
                        <Text style={styles.errorText}>{errors.date}</Text>
                      )}
                    </View>

                    {/* Time */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Time</Text>
                      <Pressable
                        onPress={() => openTimePicker(values.date, values.time)}
                        style={({ pressed }) => [
                          styles.pickerField,
                          pressed && styles.pickerFieldPressed,
                          touched.time && errors.time && styles.pickerFieldError,
                        ]}
                      >
                        <Clock size={18} color={touched.time && errors.time ? '#F87171' : '#94A3B8'} style={styles.pickerIcon} />
                        <Text style={[styles.pickerValue, !values.time && styles.pickerPlaceholder]}>
                          {values.time || 'Select time'}
                        </Text>
                      </Pressable>
                      {touched.time && errors.time && (
                        <Text style={styles.errorText}>{errors.time}</Text>
                      )}
                    </View>

                    {/* Location */}
                    <View style={styles.inputGroup}>
                      <Input
                        icon={MapPin}
                        placeholder="Location"
                        value={values.location}
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                        error={errors.location}
                        touched={touched.location}
                      />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                      <Input
                        placeholder="Description..."
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={styles.descriptionInput}
                        error={errors.description}
                        touched={touched.description}
                      />
                    </View>

                    <GradientButton
                      title={isEditing ? 'Update Event' : 'Create Event'}
                      onPress={handleSubmit}
                      style={{ marginTop: 10 }}
                    />
                  </GlassCard>

                  {/* iOS picker sheet */}
                  {Platform.OS === 'ios' && pickerMode !== null && (
                    <Modal transparent animationType="slide" visible onRequestClose={closePicker}>
                      <View style={styles.iosOverlay}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} accessibilityLabel="Dismiss picker" />
                        <View style={styles.iosSheet}>
                          <View style={styles.iosToolbar}>
                            <TouchableOpacity onPress={closePicker} hitSlop={12}>
                              <Text style={styles.iosToolbarBtn}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={commitIOSPicker} hitSlop={12}>
                              <Text style={[styles.iosToolbarBtn, styles.iosToolbarDone]}>Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={tempDate}
                            mode={pickerMode}
                            display="spinner"
                            onChange={onPickerChange}
                            themeVariant="dark"
                          />
                        </View>
                      </View>
                    </Modal>
                  )}

                  {/* Android picker */}
                  {Platform.OS === 'android' && pickerMode !== null && (
                    <DateTimePicker
                      value={tempDate}
                      mode={pickerMode}
                      display="default"
                      onChange={onPickerChange}
                    />
                  )}
                </ScrollView>
              );
            }}
          </Formik>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: 'rgba(148,163,184,0.2)',
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  modalCard: {
    borderRadius: 20,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(15,23,42,0.72)',
  },
  modalContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  pickerIcon: {
    marginRight: 10,
  },
  pickerFieldPressed: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderColor: '#93C5FD',
  },
  pickerFieldError: {
    borderColor: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
  },
  pickerValue: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
  },
  pickerPlaceholder: {
    color: '#64748B',
  },
  descriptionInput: {
    minHeight: 110,
    paddingTop: 14,
    alignItems: 'flex-start',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  iosOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  iosSheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  iosToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148,163,184,0.35)',
  },
  iosToolbarBtn: {
    fontSize: 16,
    color: '#94A3B8',
  },
  iosToolbarDone: {
    color: '#93C5FD',
    fontWeight: '700',
  },
});
