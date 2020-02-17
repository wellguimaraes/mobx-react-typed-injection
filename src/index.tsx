import { IComputedValue } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { DeepPartial } from 'ts-essentials'

type IFunction<T = any> = (...args: any[]) => T

export type CleanReturnType<
  FunctionOrComputed extends IFunction | IComputedValue<any>
  > = FunctionOrComputed extends IComputedValue<Promise<infer ComputedType>>
  ? ComputedType
  : FunctionOrComputed extends IFunction<Promise<infer FunctionReturnType>>
    ? FunctionReturnType
    : any

export function createStateManager<S>(stores: S) {
  const StoresContext = React.createContext<S>(null as any)
  StoresContext.displayName = 'StoresContext'

  const StoresProvider: any = <SP extends any = S>({
    stores: _stores = stores as any,
    children,
  }: {
    stores?: DeepPartial<SP>
    children: React.ReactNode
  }) => <StoresContext.Provider value={_stores as any}>{children}</StoresContext.Provider>

  return {
    inject: <P, I extends Partial<P>>(
      injector: (stores: S) => I,
      WrappedComponent: React.ComponentType<P>
    ): React.FC<Pick<P, Exclude<keyof P, keyof I>>> =>
      observer(props => {
        const _stores = (React.useContext(StoresContext) as any) || stores || {}
        return <WrappedComponent {...props} {...(injector(_stores) as any)} />
      }),
    withFakeStores: (stores: DeepPartial<S>) => (toRender: React.ReactNode) => (
      <StoresProvider stores={stores}>{toRender}</StoresProvider>
    ),
  }
}

