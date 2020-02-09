import * as React from 'react'
import { observer } from 'mobx-react'
import { DeepPartial } from 'ts-essentials'

export function createStateManager<S>(stores: S) {
  const StoresContext = React.createContext({} as S)
  StoresContext.displayName = 'StoresContext'

  const StoresProvider = ({
    stores: _stores = stores as any,
    children,
  }: {
    stores?: DeepPartial<S>
    children: React.ReactNode
  }) => <StoresContext.Provider value={_stores as any}>{children}</StoresContext.Provider>

  const withStores = (stores: DeepPartial<S>) => (toRender: React.ReactNode) => (
    <StoresProvider stores={stores}>{toRender}</StoresProvider>
  )

  const inject = <P, I extends Partial<P>>(
    injector: (stores: S) => I,
    WrappedComponent: React.FC<P>
  ): React.FC<Omit<P, keyof I>> =>
    observer(props => {
      const stores = React.useContext(StoresContext) as any
      return <WrappedComponent {...props} {...(injector(stores) as any)} />
    })

  return {
    stores,
    inject,
    withStores,
    StoresProvider,
  }
}
