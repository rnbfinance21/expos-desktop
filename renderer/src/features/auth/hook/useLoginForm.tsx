import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { LoginInput, loginSchema } from '@/src/features/auth/schema/login-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeypadValue } from '@/src/components/ui/keyboard/numpad';

const useLoginForm = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [focusedInput, setFocusedInput] = useState<1 | 2 | null>(null);

    const onFocus = (inputNumber: 1 | 2) => {
        setFocusedInput(inputNumber);
    };

    const form = useForm<LoginInput>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        console.log(data);
    }

    const onKeypadPress = (value: KeypadValue): void => {
        if (focusedInput === 1) {
            const current = form.getValues('username')
            if (typeof value === 'number') {
                form.setValue('username', `${current}${value}`, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                })
                return
            }
            if (value === 'reset') {
                form.setValue('username', '', {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                })
                return
            }
            form.setValue('username', current.slice(0, -1), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
            return
        }

        const currentPin = form.getValues('password')
        if (typeof value === 'number') {
            form.setValue('password', `${currentPin}${value}`, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            })
            return
        }
        if (value === 'reset') {
            form.setValue('password', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true })
            return
        }
        form.setValue('password', currentPin.slice(0, -1), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    return {
        form,
        showPassword,
        toggleShowPassword: () => setShowPassword(!showPassword),
        onSubmit: form.handleSubmit(onSubmit),
        onFocus,
        onKeypadPress,
    }
}

export default useLoginForm