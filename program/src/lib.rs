use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

use borsh::{BorshDeserialize, BorshSerialize};

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    if instruction_data.len() == 0 {
        return Err(ProgramError::InvalidInstructionData);
    }

    if instruction_data[0] == 0 {
        return create_wallet(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 1 {
        return send_lamports(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 2 {
        return change_wardens(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 3 {
        return change_owner(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 4 {
        return withdraw(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    }

    msg!("Didn't find the entrypoint required");
    Err(ProgramError::InvalidInstructionData)
}

entrypoint!(process_instruction);

fn create_wallet(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let writing_account = next_account_info(accounts_iter)?;

    let creator_account = next_account_info(accounts_iter)?;

    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }
    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut input_data = AbstractWallet::try_from_slice(&instruction_data)
        .expect("Instruction data serialization didn't worked");

    if input_data.admin != *creator_account.key {
        msg!("Invaild instruction data");
        return Err(ProgramError::InvalidInstructionData);
    }

    let rent_exemption = Rent::get()?.minimum_balance(writing_account.data_len());

    if **writing_account.lamports.borrow() < rent_exemption {
        msg!("The balance of writing_account should be more then rent_exemption");
        return Err(ProgramError::InsufficientFunds);
    }

    input_data.balance = **writing_account.lamports.borrow() - rent_exemption;

    input_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

    Ok(())
}

fn send_lamports(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let wallet_account = next_account_info(accounts_iter)?;

    let donator_program_account = next_account_info(accounts_iter)?;

    let donator_account = next_account_info(accounts_iter)?;

    if wallet_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if donator_program_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if !donator_account.is_signer {
        msg!("donator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut wallet_data = AbstractWallet::try_from_slice(*wallet_account.data.borrow())
        .expect("Serialization failed");

    wallet_data.balance += **donator_program_account.lamports.borrow();

    **wallet_account.try_borrow_mut_lamports()? += **donator_program_account.lamports.borrow();
    **donator_program_account.try_borrow_mut_lamports()? = 0;

    wallet_data.serialize(&mut &mut wallet_account.data.borrow_mut()[..])?;

    Ok(())
}

fn withdraw(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let writing_account = next_account_info(accounts_iter)?;

    let creator_account = next_account_info(accounts_iter)?;

    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }

    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let wallet_data = AbstractWallet::try_from_slice(*writing_account.data.borrow())
        .expect("Error deserializing data");

    if wallet_data.admin != *creator_account.key {
        msg!("only admins can withdraw");
        return Err(ProgramError::IncorrectProgramId);
    }

    let input_data =
        WithdrawRequest::try_from_slice(&instruction_data).expect("Value serialization failed");

    let rent_exemption = Rent::get()?.minimum_balance(writing_account.data_len());

    if **writing_account.lamports.borrow() - rent_exemption < input_data.amount {
        msg!("Insufficent balance");
        return Err(ProgramError::InsufficientFunds);
    }

    **writing_account.try_borrow_mut_lamports()? -= input_data.amount;
    **creator_account.try_borrow_mut_lamports()? += input_data.amount;

    let mut wallet_data = AbstractWallet::try_from_slice(*writing_account.data.borrow())
        .expect("Serialization failed");

    wallet_data.balance -= input_data.amount;
    wallet_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

    Ok(())
}

fn change_wardens(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let writing_account = next_account_info(accounts_iter)?;

    let creator_account = next_account_info(accounts_iter)?;

    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }

    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let wallet_data = AbstractWallet::try_from_slice(*writing_account.data.borrow())
        .expect("Error deserializing data");

    if wallet_data.admin != *creator_account.key {
        msg!("only admins can withdraw");
        return Err(ProgramError::IncorrectProgramId);
    }

    let input_data =
        WardenChangeRequest::try_from_slice(&instruction_data).expect("Value serialization failed");

    let mut wallet_data = AbstractWallet::try_from_slice(*writing_account.data.borrow())
        .expect("Serialization failed");

    wallet_data.warden1 = input_data.warden1;
    wallet_data.warden2 = input_data.warden2;
    wallet_data.warden3 = input_data.warden3;
    wallet_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

    Ok(())
}

fn change_owner(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let writing_account = next_account_info(accounts_iter)?;

    let creator_account = next_account_info(accounts_iter)?;

    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }

    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let input_data =
        OwnerChangeRequest::try_from_slice(&instruction_data).expect("Value serialization failed");

    let mut wallet_data = AbstractWallet::try_from_slice(*writing_account.data.borrow())
        .expect("Serialization failed");

    if *creator_account.key == wallet_data.warden1
        || *creator_account.key == wallet_data.warden2
        || *creator_account.key == wallet_data.warden3
    {
        wallet_data.admin = input_data.new_owner;
        wallet_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;
    }

    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct AbstractWallet {
    pub admin: Pubkey,
    pub description: String,
    pub warden1: Pubkey,
    pub warden2: Pubkey,
    pub warden3: Pubkey,
    pub balance: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct WithdrawRequest {
    pub amount: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct WardenChangeRequest {
    pub warden1: Pubkey,
    pub warden2: Pubkey,
    pub warden3: Pubkey,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct OwnerChangeRequest {
    pub new_owner: Pubkey,
}
