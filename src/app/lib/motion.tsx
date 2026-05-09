import React from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

type MotionProps = React.PropsWithChildren<Record<string, unknown>>;

type MotionTag =
  | 'div'
  | 'button'
  | 'span'
  | 'p'
  | 'section'
  | 'main'
  | 'nav'
  | 'ol'
  | 'ul'
  | 'li'
  | 'a'
  | 'form'
  | 'img'
  | 'label'
  | 'input'
  | 'textarea'
  | 'svg';

function createMotionComponent(tag: MotionTag) {
  const Component =
    tag === 'button' || tag === 'a'
      ? Pressable
      : tag === 'p' || tag === 'span' || tag === 'li' || tag === 'label'
        ? Text
        : tag === 'img'
          ? Image
          : tag === 'input' || tag === 'textarea'
            ? TextInput
            : View;

  return function MotionComponent({ children, ...props }: MotionProps) {
    const nextProps = { ...(props as Record<string, unknown>) };

    if (Component === Pressable && typeof nextProps.onClick === 'function' && nextProps.onPress == null) {
      nextProps.onPress = nextProps.onClick;
    }

    if (Component === TextInput) {
      if (typeof nextProps.onChangeText !== 'function' && typeof nextProps.onChange === 'function') {
        nextProps.onChangeText = nextProps.onChange;
      }
    }

    return React.createElement(Component as React.ElementType, nextProps as never, children);
  };
}

const intrinsicTags: MotionTag[] = [
  'div',
  'button',
  'span',
  'p',
  'section',
  'main',
  'nav',
  'ol',
  'ul',
  'li',
  'a',
  'form',
  'img',
  'label',
  'input',
  'textarea',
  'svg',
] as const;

export const motion = new Proxy({}, {
  get: (_target, prop: string) => createMotionComponent((prop as MotionTag) || 'div'),
}) as Record<MotionTag, React.ComponentType<MotionProps>> & {
  [key: string]: React.ComponentType<MotionProps>;
};

export function AnimatePresence({ children }: MotionProps) {
  return <>{children}</>;
}