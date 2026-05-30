import React from 'react'
import { useLoginForm } from '../hooks/UseLoginForm';
import { TextInput } from '../../../components/globals/forms';
import { ErrorLabel } from '../../../components/globals/labels';
import { DynamicHeroIcon } from '../../../components/globals/icons';
import { Button } from '../../../components/globals/buttons';
import { Numpad } from '../../../components/globals/keyboard';

const LoginForm = () => {
    const { form,
        onSubmit, onFocus, secureText, setSecureText, isLoading, inputNumpad, setInputNumpad } = useLoginForm();

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-4">
                <TextInput
                    type="text"
                    placeholder="Kode Staff"
                    className="text-left"
                    onClick={() => onFocus(1)}
                    {...form.register("username")}
                />
                {form.formState.errors.username ? <ErrorLabel text={typeof form.formState.errors.username?.message === 'string' ? form.formState.errors.username.message : undefined} /> : null}
            </div>
            <div className="mb-4">
                <div className="relative">
                    <TextInput
                        type={secureText ? "password" : "text"}
                        placeholder="Pin / Kata Sandi"
                        className="text-left"
                        onClick={() => onFocus(2)}
                        {...form.register("password")}
                    />
                    {form.formState.errors.password ? (
                        <ErrorLabel text={typeof form.formState.errors.password?.message === 'string' ? form.formState.errors.password.message : undefined} />
                    ) : null}
                    <div
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={() => setSecureText(!secureText)}
                    >
                        <DynamicHeroIcon
                            icon={secureText ? "EyeIcon" : "EyeSlashIcon"}
                            className="h-6 w-6 text-gray-500"
                        />
                    </div>
                </div>
            </div>
            <div>
                <Button type="submit" blok isLoading={isLoading}>
                    Masuk
                </Button>
            </div>
            <div className="mt-4">
                <Numpad value={inputNumpad} onChange={setInputNumpad} isNullable />
            </div>
        </form>
    )
}

export default LoginForm