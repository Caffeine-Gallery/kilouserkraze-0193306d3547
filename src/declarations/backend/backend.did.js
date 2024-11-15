export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addUser' : IDL.Func([], [IDL.Bool], []),
    'getCurrentUserCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getMaxUsers' : IDL.Func([], [IDL.Nat], ['query']),
    'isAtCapacity' : IDL.Func([], [IDL.Bool], ['query']),
    'removeUser' : IDL.Func([], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
