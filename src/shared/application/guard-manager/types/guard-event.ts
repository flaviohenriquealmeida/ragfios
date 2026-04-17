// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { GuardEvents } from './guard-events';

export type GuardEvent = (typeof GuardEvents)[keyof typeof GuardEvents];

