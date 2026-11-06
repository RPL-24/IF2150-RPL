import { IsianTeks, type IsianTeksProps } from './IsianTeks';

/**
 * Multi-line text field (questions, feedback, FAQ answers). Same look and
 * props as IsianTeks, with a taller box that grows with its content.
 */
export function AreaTeks(props: Omit<IsianTeksProps, 'multiline'>) {
  return <IsianTeks multiline {...props} />;
}
