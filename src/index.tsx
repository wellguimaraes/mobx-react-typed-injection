import { observer } from 'mobx-react'
import * as React from 'react'
import { DeepPartial } from 'ts-essentials'

type InjectedComponent<TProps, TInjection extends Partial<TProps>> = React.FC<
  Pick<TProps, Exclude<keyof TProps, keyof TInjection>>
>

export function createStateManager<TStore>(stores: TStore) {
  const StoresContext = React.createContext<TStore>(null as any)
  StoresContext.displayName = 'StoresContext'

  const StoresProvider: any = <SP extends any = TStore>({
    stores: _stores = stores as any,
    children,
  }: {
    stores?: DeepPartial<SP>
    children: React.ReactNode
  }) => <StoresContext.Provider value={_stores as any}>{children}</StoresContext.Provider>

  return {
    inject: <TProps, TInjection extends Partial<TProps>>(
      injector: (stores: TStore) => TInjection,
      WrappedComponent: React.ComponentType<TProps>
    ): InjectedComponent<TProps, TInjection> => {
      const _InjectedComponent: React.FunctionComponent = props => {
        const _stores = (React.useContext(StoresContext) as any) || stores || {}
        return <WrappedComponent {...props} {...(injector(_stores) as any)} />
      }

      const wrappedDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
      _InjectedComponent.displayName = `MobXTypedInjection(${wrappedDisplayName})`

      return observer(_InjectedComponent)
    },
    withFakeStores: (stores: DeepPartial<TStore>) => (children: React.ReactNode) => (
      <StoresProvider stores={stores}>{children}</StoresProvider>
    ),
  }
}


