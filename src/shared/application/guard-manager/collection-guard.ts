import { Guard } from './guards/guard';
import { GuardContext } from './guards/guard-context';
import { GuardResult } from './guards/guard-result';

export class CollectionGuard<T> implements Guard<T[]> {
	constructor(
		private readonly guard: Guard<string>,
		private readonly fieldSelector: (item: T) => string,
		private readonly fieldUpdater: (item: T, value: string) => T
	) {}

	get name(): string {
		return `Collection(${this.guard.name})`;
	}

	async run(input: T[], context: GuardContext): Promise<GuardResult<T[]>> {
		const results: T[] = [];

		for (const item of input) {
			const result = await this.guard.run(this.fieldSelector(item), context);

			if (!result.success) {
				return {
					success: false,
					data: input, // Return the original state
					reason: result.reason,
					guard: `${this.name} > ${result.guard}`
				};
			}

			results.push(this.fieldUpdater(item, result.data));
		}

		return { success: true, data: results, guard: this.name };
	}
}

