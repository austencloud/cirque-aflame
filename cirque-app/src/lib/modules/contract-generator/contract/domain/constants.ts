/**
 * Contract Domain Constants
 */

import type {
	Contract,
	Client,
	Producer,
	Event,
	Fees,
	Services,
	Cancellation,
	Schedule,
	Obligations,
	Safety
} from './types';

export const DEFAULT_CLIENT: Client = {
	name: '',
	phone: '',
	email: '',
	title: ''
};

export const DEFAULT_PRODUCER: Producer = {
	name: '',
	company: '',
	phone: '',
	email: ''
};

export const DEFAULT_EVENT: Event = {
	location: '',
	date: new Date().toISOString().split('T')[0]
};

export const DEFAULT_FEES: Fees = {
	total_fee: 0,
	requires_deposit: false,
	deposit_amount: 0,
	balance: 0,
	payment_methods: 'Bank Transfer, Check, Cash',
	payment_terms: 'Due upon signing'
};

export const DEFAULT_SERVICES: Services = {
	performance_type: 'Caribbean Dance Performance',
	duration_minutes: 60,
	time_tbd: false,
	performance_time: '7:00 PM',
	costume: 'Provided by performer',
	music_provided_by: 'Performer',
	music_notes: '',
	additional_services: ''
};

export const DEFAULT_CANCELLATION: Cancellation = {
	client_policy:
		'Client cancellation within 30 days of event: 50% fee retained. Within 14 days: 100% fee retained.',
	producer_policy:
		'Producer cancellation within 30 days of event: 50% refund. Within 14 days: No refund.',
	force_majeure:
		'In case of force majeure (weather, natural disaster, etc.), both parties agree to reschedule or refund.'
};

export const DEFAULT_SCHEDULE: Schedule = {
	arrival_minutes_before: 30,
	setup_minutes: 15,
	late_policy: 'Performer arriving more than 15 minutes late may result in fee reduction.',
	changes_policy: 'Schedule changes must be approved by both parties in writing.'
};

export const DEFAULT_OBLIGATIONS: Obligations = {
	producer_obligations: 'Provide performance space, sound system, and lighting as agreed.',
	client_obligations: 'Provide agreed-upon performance space and technical support.',
	venue_requirements: 'Minimum 10x10 ft performance space, adequate lighting, and sound system.'
};

export const DEFAULT_SAFETY: Safety = {
	general_safety_policy:
		'All parties agree to follow venue safety guidelines and local regulations.',
	specific_requirements: 'Performer requires clear performance space free of obstacles.',
	liability_terms:
		'Producer is responsible for liability insurance. Performer assumes no liability for venue-related incidents.'
};

export const DEFAULT_CONTRACT: Contract = {
	title: 'Caribbean Dance Performance Agreement',
	subtitle: 'Official Contract for Live Performance Services',
	effective_date: new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}),
	performer_name: 'Robert Bershadsky',
	client: DEFAULT_CLIENT,
	producer: DEFAULT_PRODUCER,
	event: DEFAULT_EVENT,
	fees: DEFAULT_FEES,
	services: DEFAULT_SERVICES,
	cancellation: DEFAULT_CANCELLATION,
	schedule: DEFAULT_SCHEDULE,
	obligations: DEFAULT_OBLIGATIONS,
	safety: DEFAULT_SAFETY
};

export const DEPOSIT_PERCENTAGE = 0.5; // 50% of total fee
