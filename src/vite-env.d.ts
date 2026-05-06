/// <reference types="vite/client" />

type IonIconElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    name?: string
    size?: string
  },
  HTMLElement
>

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': IonIconElement
    }
  }
  interface HTMLAttributes<T> {
    name?: string
  }
}
