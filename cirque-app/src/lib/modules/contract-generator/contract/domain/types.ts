/**
 * Contract Domain Types
 * Pure data structures - no business logic
 */

export interface Client {
	name: string;
	phone: string;
	email: string;
	title: string;
}

export interface Producer {
	name: string;
	company: string;
	phone: string;
	email: string;
}

export interface Event {
	location: string;
	date: string;
}

export interface Fees {
	total_fee: number;
	requires_deposit: boolean;
	deposit_amount: number;
	balance: number;
	payment_methods: string;
	payment_terms: string;
}

export interface Services {
	performance_type: string;
	duration_minutes: number;
	time_tbd: boolean;
	performance_time: string;
	costume: string;
	music_provided_by: string;
	music_notes: string;
	additional_services: string;
}

export interface Cancellation {
	client_policy: string;
	producer_policy: string;
	force_majeure: string;
}

export interface Schedule {
	arrival_minutes_before: number;
	setup_minutes: number;
	late_policy: string;
	changes_policy: string;
}

export interface Obligations {
	producer_obligations: string;
	client_obligations: string;
	venue_requirements: string;
}

export interface Safety {
	general_safety_policy: string;
	specific_requirements: string;
	liability_terms: string;
}

export interface Contract {
	title: string;
	subtitle: string;
	effective_date: string;
	performer_name: string;
	client: Client;
	producer: Producer;
	event: Event;
	fees: Fees;
	services: Services;
	cancellation: Cancellation;
	schedule: Schedule;
	obligations: Obligations;
	safety: Safety;
}
