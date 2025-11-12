// Archivo: useDebouncedCallback.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <only for useDebouncedCallback> */
import { useCallback, useEffect, useMemo, useRef } from 'react'

interface DebouncedOptions {
  maxWait?: number
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  flush: () => void
}

/**
 * Crea una función "debounced" que también expone controles
 * como .flush()
 * @param {function} callback La función a ejecutar
 * @param {number} delay El tiempo de espera (debounce)
 * @param {object} options Opciones como { maxWait }
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: DebouncedOptions = {}
): DebouncedFunction<T> {
  const { maxWait } = options

  // Refs para guardar todo sin causar re-renders
  const callbackRef = useRef<T>(callback)
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const maxWaitTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastArgsRef = useRef<Parameters<T> | null>(null) // Últimos argumentos recibidos

  // --- Actualizar el ref del callback ---
  // Esto asegura que siempre tengamos la *última* versión de la
  // función de callback (ej. una que usa el 'content' más reciente)
  // sin tener que reiniciar los timers.
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // --- Función 'execute' ---
  // Esta es la función que realmente ejecuta el guardado.
  const execute = useCallback(() => {
    // Solo si hay argumentos pendientes (si se llamó a 'debounced')
    if (lastArgsRef.current) {
      // Ejecutamos el callback más reciente con los args guardados
      callbackRef.current(...lastArgsRef.current)

      // Limpiamos todo para el próximo ciclo
      lastArgsRef.current = null
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      if (maxWaitTimerRef.current) clearTimeout(maxWaitTimerRef.current)
      delayTimerRef.current = null
      maxWaitTimerRef.current = null
    }
  }, []) // Vacío, depende de refs

  // --- Función 'flush' (Pública) ---
  // La que el usuario llamará manualmente
  const flush = useCallback(() => {
    // Simplemente llama a 'execute' ahora mismo
    console.log('FLUSH: Forzando ejecución...')
    execute()
  }, [execute])

  // --- La función 'debounced' (Pública) ---
  // Esta es la función que retornamos y que el usuario llamará
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      // 1. Guardar los últimos argumentos (ej. el 'content' nuevo)
      lastArgsRef.current = args

      // 2. Lógica del 'delay' (se resetea)
      // Limpiamos el timer anterior
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      // Creamos uno nuevo
      delayTimerRef.current = setTimeout(execute, delay)

      // 3. Lógica del 'maxWait' (NO se resetea)
      if (maxWait && !maxWaitTimerRef.current) {
        // Si maxWait está activo y *no* hay un timer de maxWait
        // corriendo, iniciamos uno.
        maxWaitTimerRef.current = setTimeout(execute, maxWait)
      }
    },
    [delay, maxWait, execute]
  )

  // --- Limpieza al desmontar ---
  // Nos aseguramos de limpiar timers si el componente desaparece
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      if (maxWaitTimerRef.current) clearTimeout(maxWaitTimerRef.current)
    }
  }, [])

  // --- Retorno ---
  // Retornamos la función 'debounced' y le "adjuntamos"
  // la función 'flush' como una propiedad.
  // Usamos useMemo para que este objeto sea estable.
  return useMemo(() => Object.assign(debounced, { flush }), [debounced, flush])
}
