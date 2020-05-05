import {Ocean} from "../src/Ocean";

describe('@ocean/core', () => {
    it('should throw an error for missing configuration', () => {
        const a = () => {
            // @ts-ignore
            new Ocean();
        }

        expect(a).toThrowError();
        expect(a).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for empty configuration', () => {
        const a = () => {
            // @ts-ignore
            new Ocean({});
        }

        expect(a).toThrowError();
        expect(a).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for adapter not found', () => {
        const a = () => {
            // @ts-ignore
            new Ocean({
                // @ts-ignore
                adapter: 'fake-package',
                // @ts-ignore
                provider: 'fake-provider'
            });
        }

        expect(a).toThrowError();
        expect(a).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error for provider found', () => {
        const a = () => {
            // @ts-ignore
            new Ocean({
                // @ts-ignore
                adapter: '@ocean/nextjs-adapter',
                // @ts-ignore
                provider: 'fake-provider'
            });
        }

        expect(a).toThrowError();
        expect(a).toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error when correct packages are passed', () => {
        const a = () => {
            // @ts-ignore
            new Ocean({
                // @ts-ignore
                adapter: '@ocean/nextjs-adapter',
                // @ts-ignore
                provider: '@ocean/aws-provider'
            });
        }

        expect(a).not.toThrowError();
    });
})
