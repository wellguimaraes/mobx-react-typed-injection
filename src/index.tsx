import { observer } from 'mobx-react'
import * as React from 'react'
import { DeepPartial } from 'ts-essentials'

type InjectedComponent<TProps, TInjection extends Partial<TProps>> = React.FC<
  Pick<TProps, Exclude<keyof TProps, keyof TInjection>>
>

export function createStateManager<TStores>(stores: TStores) {
  const StoresContext = React.createContext<TStores>(null as any)
  StoresContext.displayName = 'StoresContext'

  const StoresProvider: any = ({
    stores: _stores = stores as any,
    children,
  }: {
    stores?: DeepPartial<TStores>
    children: React.ReactNode
  }) => <StoresContext.Provider value={_stores as any}>{children}</StoresContext.Provider>

  return {
    inject: <TProps, TInjection extends Partial<TProps>>(
      injector: (stores: TStores) => TInjection,
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
    withFakeStores: (stores: DeepPartial<TStores>) => (children: React.ReactNode) => (
      <StoresProvider stores={stores}>{children}</StoresProvider>
    ),
  }
}


