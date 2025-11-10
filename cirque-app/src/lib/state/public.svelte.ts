/**
 * Public Website State Management
 * Using Svelte 5 Runes for reactive state
 */

import { browser } from '$app/environment';
import type { Service } from '$lib/data/services';

// Navigation State - only use $state in browser to avoid SSR issues
export const navigationState = browser ? $state({
  isMenuOpen: false,
  activeSection: '',
  isScrolled: false,
  scrollY: 0
}) : {
  isMenuOpen: false,
  activeSection: '',
  isScrolled: false,
  scrollY: 0
};

// Services State
export const servicesState = browser ? $state<{
  services: Service[];
  activeService: Service | null;
  filterCategory: Service['category'] | null;
}>({
  services: [],
  activeService: null,
  filterCategory: null
}) : {
  services: [],
  activeService: null,
  filterCategory: null
};

// Booking Form State
export interface BookingFormData {
  // Step 1: Event Details
  eventType: string;
  eventDate: Date | null;
  eventTime: string;
  location: string;
  guestCount: number;

  // Step 2: Services
  selectedServices: string[]; // service IDs
  duration: '1hour' | '2hours' | '4hours' | 'fullday' | 'custom';
  customDuration?: string;
  specialRequests: string;

  // Step 3: Contact Info
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'either';
  budgetRange: string;

  // Step 4: Additional
  hearAboutUs: string;
  marketingConsent: boolean;
}

export const bookingFormState = browser ? $state<{
  currentStep: number;
  totalSteps: number;
  formData: Partial<BookingFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
}>({
  currentStep: 1,
  totalSteps: 4,
  formData: {
    eventType: '',
    eventDate: null,
    eventTime: '',
    location: '',
    guestCount: 50,
    selectedServices: [],
    duration: '2hours',
    specialRequests: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: 'either',
    budgetRange: '',
    hearAboutUs: '',
    marketingConsent: false
  },
  errors: {},
  isSubmitting: false,
  isComplete: false
}) : {
  currentStep: 1,
  totalSteps: 4,
  formData: {
    eventType: '',
    eventDate: null,
    eventTime: '',
    location: '',
    guestCount: 50,
    selectedServices: [],
    duration: '2hours',
    specialRequests: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: 'either',
    budgetRange: '',
    hearAboutUs: '',
    marketingConsent: false
  },
  errors: {},
  isSubmitting: false,
  isComplete: false
};

// Gallery State
export const galleryState = browser ? $state<{
  images: Array<{
    id: string;
    src: string;
    alt: string;
    category: string;
    service?: string;
  }>;
  activeImage: number | null;
  filterCategory: string | null;
  isLightboxOpen: boolean;
}>({
  images: [],
  activeImage: null,
  filterCategory: null,
  isLightboxOpen: false
}) : {
  images: [],
  activeImage: null,
  filterCategory: null,
  isLightboxOpen: false
};

// Testimonials State
export interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  date: string;
  rating: number;
  quote: string;
  photo?: string;
  service?: string;
}

export const testimonialsState = browser ? $state<{
  testimonials: Testimonial[];
  activeIndex: number;
  autoPlay: boolean;
}>({
  testimonials: [],
  activeIndex: 0,
  autoPlay: true
}) : {
  testimonials: [],
  activeIndex: 0,
  autoPlay: true
};

// Stats Counter State
export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: string;
}

export const statsState = browser ? $state<{
  stats: Stat[];
  hasAnimated: boolean;
}>({
  stats: [
    { label: 'Events Produced', value: 500, suffix: '+', icon: 'Calendar' },
    { label: 'Professional Performers', value: 50, suffix: '+', icon: 'Users' },
    { label: 'Insured & Safe', value: 100, suffix: '%', icon: 'Shield' },
    { label: 'Average Rating', value: 4.9, suffix: '/5', icon: 'Star' }
  ],
  hasAnimated: false
}) : {
  stats: [
    { label: 'Events Produced', value: 500, suffix: '+', icon: 'Calendar' },
    { label: 'Professional Performers', value: 50, suffix: '+', icon: 'Users' },
    { label: 'Insured & Safe', value: 100, suffix: '%', icon: 'Shield' },
    { label: 'Average Rating', value: 4.9, suffix: '/5', icon: 'Star' }
  ],
  hasAnimated: false
};

// Actions
export function toggleMenu() {
  navigationState.isMenuOpen = !navigationState.isMenuOpen;
}

export function closeMenu() {
  navigationState.isMenuOpen = false;
}

export function setActiveSection(section: string) {
  navigationState.activeSection = section;
}

export function updateScrollPosition(scrollY: number) {
  navigationState.scrollY = scrollY;
  navigationState.isScrolled = scrollY > 50;
}

export function nextBookingStep() {
  if (bookingFormState.currentStep < bookingFormState.totalSteps) {
    bookingFormState.currentStep++;
  }
}

export function prevBookingStep() {
  if (bookingFormState.currentStep > 1) {
    bookingFormState.currentStep--;
  }
}

export function updateBookingFormData(data: Partial<BookingFormData>) {
  bookingFormState.formData = { ...bookingFormState.formData, ...data };
}

export function setBookingError(field: string, error: string) {
  bookingFormState.errors[field] = error;
}

export function clearBookingErrors() {
  bookingFormState.errors = {};
}

export function openLightbox(index: number) {
  galleryState.activeImage = index;
  galleryState.isLightboxOpen = true;
}

export function closeLightbox() {
  galleryState.isLightboxOpen = false;
  galleryState.activeImage = null;
}

export function nextImage() {
  if (galleryState.activeImage !== null) {
    const nextIndex = (galleryState.activeImage + 1) % galleryState.images.length;
    galleryState.activeImage = nextIndex;
  }
}

export function prevImage() {
  if (galleryState.activeImage !== null) {
    const prevIndex =
      galleryState.activeImage === 0
        ? galleryState.images.length - 1
        : galleryState.activeImage - 1;
    galleryState.activeImage = prevIndex;
  }
}

export function setGalleryFilter(category: string | null) {
  galleryState.filterCategory = category;
}

export function nextTestimonial() {
  testimonialsState.activeIndex =
    (testimonialsState.activeIndex + 1) % testimonialsState.testimonials.length;
}

export function prevTestimonial() {
  testimonialsState.activeIndex =
    testimonialsState.activeIndex === 0
      ? testimonialsState.testimonials.length - 1
      : testimonialsState.activeIndex - 1;
}

export function setTestimonialIndex(index: number) {
  testimonialsState.activeIndex = index;
}

export function toggleTestimonialAutoPlay() {
  testimonialsState.autoPlay = !testimonialsState.autoPlay;
}

export function markStatsAsAnimated() {
  statsState.hasAnimated = true;
}
