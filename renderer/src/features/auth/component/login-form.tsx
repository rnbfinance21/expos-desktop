import React from 'react'
import useLoginForm from '@/src/features/auth/hook/useLoginForm'
import TextInput from '@/src/components/ui/form/text-input';
import ErrorLabel from '@/src/components/ui/form/error-label';
import Button from '@/src/components/ui/button/button';
import Numpad from '@/src/components/ui/keyboard/numpad';
import DynamicHeroIcon from '@/src/components/ui/icon/dynamic-hero-icon';

const LoginForm = () => {
    const { onSubmit, onFocus, form, showPassword, toggleShowPassword, onKeypadPress } = useLoginForm();
    const { errors } = form.formState

    return (
        <form onSubmit={onSubmit} className="mb-4">
            <div className="mb-4">
                <TextInput
                    type="text"
                    placeholder="Kode Staff"
                    className="text-left"
                    onClick={() => onFocus(1)}
                    {...form.register("username")}
                />
                {errors.username ? <ErrorLabel text={errors.username.message} /> : null}
            </div>
            <div className="mb-4">
                <div className="relative">
                    <TextInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Pin / Kata Sandi"
                        className="text-left"
                        onClick={() => onFocus(2)}
                        {...form.register("password")}
                    />
                    {errors.password ? (
                        <ErrorLabel text={errors.password.message} />
                    ) : null}
                    <div
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={toggleShowPassword}
                    >
                        <DynamicHeroIcon
                            icon={showPassword ? "EyeIcon" : "EyeSlashIcon"}
                            className="h-6 w-6 text-gray-500"
                        />
                    </div>
                </div>
            </div>
            <div>
                <Button type="submit" blok isLoading={false}>
                    Masuk
                </Button>
            </div>
            <div className="mt-4">
                <Numpad onPress={onKeypadPress} />
            </div>
        </form>
    )
}

export default LoginForm